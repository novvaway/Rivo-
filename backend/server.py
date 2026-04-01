from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from fastapi import FastAPI, APIRouter, HTTPException, Query, Request, Response, Depends, UploadFile, File, Form
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import base64

from auth_utils import (
    hash_password, verify_password, 
    create_access_token, create_refresh_token,
    get_current_user, get_current_admin
)
from PIL import Image
import io

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")

# Models
class Product(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name_ar: str
    name_en: str
    category: str
    price: float
    old_price: Optional[float] = None
    discount_percent: Optional[int] = None
    image_url: str
    stickers: List[str] = []
    sizes: List[str] = ["S", "M", "L", "XL", "XXL"]
    colors: List[str] = ["أسود", "أبيض", "رمادي"]
    description_ar: Optional[str] = None
    description_en: Optional[str] = None
    in_stock: bool = True

class ProductCreate(BaseModel):
    name_ar: str
    name_en: str
    category: str
    price: float
    old_price: Optional[float] = None
    image_url: str
    stickers: List[str] = []
    sizes: List[str] = ["S", "M", "L", "XL", "XXL"]
    colors: List[str] = ["أسود", "أبيض", "رمادي"]
    description_ar: Optional[str] = None
    description_en: Optional[str] = None
    in_stock: bool = True

class ProductUpdate(BaseModel):
    name_ar: Optional[str] = None
    name_en: Optional[str] = None
    category: Optional[str] = None
    price: Optional[float] = None
    old_price: Optional[float] = None
    image_url: Optional[str] = None
    stickers: Optional[List[str]] = None
    sizes: Optional[List[str]] = None
    colors: Optional[List[str]] = None
    description_ar: Optional[str] = None
    description_en: Optional[str] = None
    in_stock: Optional[bool] = None

class CartItem(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    product_id: str
    product_name_ar: str
    product_name_en: str
    size: str
    color: str
    quantity: int = 1
    price: float
    image_url: str

class Order(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    customer_name: str
    customer_phone: str
    customer_address: str
    items: List[CartItem]
    total_amount: float
    payment_method: str
    notes: Optional[str] = None
    status: str = "pending"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class OrderCreate(BaseModel):
    customer_name: str
    customer_phone: str
    customer_address: str
    items: List[CartItem]
    total_amount: float
    payment_method: str
    notes: Optional[str] = None

class LoginRequest(BaseModel):
    email: str
    password: str

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    email: str
    name: str
    role: str = "admin"

# Auth Routes
@api_router.post("/auth/login")
async def login(credentials: LoginRequest, response: Response):
    email = credentials.email.lower()
    user = await db.users.find_one({"email": email})
    
    if not user or not verify_password(credentials.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    user_id = str(user["_id"])
    access_token = create_access_token(user_id, email)
    refresh_token = create_refresh_token(user_id)
    
    response.set_cookie(
        key="access_token", 
        value=access_token, 
        httponly=True, 
        secure=False, 
        samesite="lax", 
        max_age=3600,
        path="/"
    )
    response.set_cookie(
        key="refresh_token", 
        value=refresh_token, 
        httponly=True, 
        secure=False, 
        samesite="lax", 
        max_age=604800,
        path="/"
    )
    
    return {
        "email": user["email"],
        "name": user.get("name", "Admin"),
        "role": user.get("role", "admin")
    }

@api_router.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")
    return {"message": "Logged out successfully"}

@api_router.get("/auth/me")
async def get_me(request: Request):
    user = await get_current_user(request, db)
    return user

# Public Routes
@api_router.get("/")
async def root():
    return {"message": "RIVO - Wear Confidence API"}

@api_router.get("/products", response_model=List[Product])
async def get_products(
    category: Optional[str] = None,
    search: Optional[str] = None,
    sort_by: Optional[str] = "default"
):
    query = {}
    
    if category and category != "all":
        query["category"] = category
    
    products = await db.products.find(query, {"_id": 0}).to_list(1000)
    
    if search:
        search_lower = search.lower()
        products = [
            p for p in products 
            if search_lower in p.get("name_ar", "").lower() 
            or search_lower in p.get("name_en", "").lower()
        ]
    
    if sort_by == "price_asc":
        products.sort(key=lambda x: x.get("price", 0))
    elif sort_by == "price_desc":
        products.sort(key=lambda x: x.get("price", 0), reverse=True)
    
    return products

@api_router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: str):
    product = await db.products.find_one({"id": product_id}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@api_router.post("/orders", response_model=Order)
async def create_order(order_input: OrderCreate):
    order_dict = order_input.model_dump()
    order_obj = Order(**order_dict)
    
    doc = order_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.orders.insert_one(doc)
    return order_obj

# Admin Routes - Products Management
@api_router.get("/admin/products", response_model=List[Product])
async def admin_get_products(request: Request):
    await get_current_admin(request, db)
    products = await db.products.find({}, {"_id": 0}).to_list(1000)
    return products

@api_router.post("/admin/products", response_model=Product)
async def admin_create_product(product: ProductCreate, request: Request):
    await get_current_admin(request, db)
    
    product_dict = product.model_dump()
    product_obj = Product(**product_dict)
    
    # Calculate discount if old_price is provided
    if product_obj.old_price and product_obj.old_price > product_obj.price:
        product_obj.discount_percent = int(((product_obj.old_price - product_obj.price) / product_obj.old_price) * 100)
    
    doc = product_obj.model_dump()
    await db.products.insert_one(doc)
    
    return product_obj

@api_router.put("/admin/products/{product_id}", response_model=Product)
async def admin_update_product(product_id: str, product_update: ProductUpdate, request: Request):
    await get_current_admin(request, db)
    
    existing = await db.products.find_one({"id": product_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Product not found")
    
    update_data = product_update.model_dump(exclude_unset=True)
    
    # Recalculate discount if price or old_price changed
    if "price" in update_data or "old_price" in update_data:
        price = update_data.get("price", existing.get("price"))
        old_price = update_data.get("old_price", existing.get("old_price"))
        
        if old_price and old_price > price:
            update_data["discount_percent"] = int(((old_price - price) / old_price) * 100)
        else:
            update_data["discount_percent"] = None
    
    await db.products.update_one({"id": product_id}, {"$set": update_data})
    
    updated_product = await db.products.find_one({"id": product_id}, {"_id": 0})
    return Product(**updated_product)

@api_router.delete("/admin/products/{product_id}")
async def admin_delete_product(product_id: str, request: Request):
    await get_current_admin(request, db)
    
    result = await db.products.delete_one({"id": product_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    
    return {"message": "Product deleted successfully"}

@api_router.post("/admin/upload-image")
async def admin_upload_image(request: Request, file: UploadFile = File(...)):
    await get_current_admin(request, db)
    
    contents = await file.read()
    
    # Compress image using Pillow
    try:
        img = Image.open(io.BytesIO(contents))
        # Convert RGBA to RGB for JPEG
        if img.mode in ('RGBA', 'P'):
            img = img.convert('RGB')
        # Resize if too large (max 800px width)
        max_width = 800
        if img.width > max_width:
            ratio = max_width / img.width
            new_size = (max_width, int(img.height * ratio))
            img = img.resize(new_size, Image.LANCZOS)
        # Save as JPEG with compression
        buffer = io.BytesIO()
        img.save(buffer, format='JPEG', quality=75, optimize=True)
        compressed = buffer.getvalue()
        content_type = 'image/jpeg'
    except Exception:
        compressed = contents
        content_type = file.content_type
    
    base64_image = base64.b64encode(compressed).decode('utf-8')
    image_url = f"data:{content_type};base64,{base64_image}"
    
    return {"image_url": image_url}

# Admin Routes - Orders Management
@api_router.get("/admin/orders")
async def admin_get_orders(request: Request):
    await get_current_admin(request, db)
    orders = await db.orders.find({}, {"_id": 0}).to_list(1000)
    
    for order in orders:
        if isinstance(order.get('created_at'), str):
            order['created_at'] = datetime.fromisoformat(order['created_at'])
    
    return orders

# Startup: Seed Admin
@app.on_event("startup")
async def startup_event():
    admin_email = os.environ.get("ADMIN_EMAIL", "aziz@rivo.ps")
    admin_password = os.environ.get("ADMIN_PASSWORD", "Rivo@aziz2026")
    
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        hashed = hash_password(admin_password)
        await db.users.insert_one({
            "email": admin_email,
            "password_hash": hashed,
            "name": "Admin",
            "role": "admin",
            "created_at": datetime.now(timezone.utc)
        })
        print(f"✅ Admin created: {admin_email}")
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one(
            {"email": admin_email}, 
            {"$set": {"password_hash": hash_password(admin_password)}}
        )
        print(f"✅ Admin password updated: {admin_email}")
    
    # Write credentials to file
    Path("memory").mkdir(exist_ok=True)
    with open("/app/memory/test_credentials.md", "w") as f:
        f.write(f"# Admin Credentials\\n\\n")
        f.write(f"**Email**: {admin_email}\\n")
        f.write(f"**Password**: {admin_password}\\n")
        f.write(f"**Role**: admin\\n\\n")
        f.write(f"## Endpoints\\n")
        f.write(f"- POST /api/auth/login\\n")
        f.write(f"- GET /api/auth/me\\n")
        f.write(f"- POST /api/auth/logout\\n")
        f.write(f"- GET /api/admin/products\\n")
        f.write(f"- POST /api/admin/products\\n")
        f.write(f"- PUT /api/admin/products/{{id}}\\n")
        f.write(f"- DELETE /api/admin/products/{{id}}\\n")
    
    # Compress existing large base64 images
    products = await db.products.find({}).to_list(1000)
    for p in products:
        img_url = p.get("image_url", "")
        if img_url.startswith("data:") and len(img_url) > 200_000:
            try:
                header, b64data = img_url.split(",", 1)
                raw = base64.b64decode(b64data)
                img = Image.open(io.BytesIO(raw))
                if img.mode in ('RGBA', 'P'):
                    img = img.convert('RGB')
                if img.width > 800:
                    ratio = 800 / img.width
                    img = img.resize((800, int(img.height * ratio)), Image.LANCZOS)
                buf = io.BytesIO()
                img.save(buf, format='JPEG', quality=75, optimize=True)
                new_b64 = base64.b64encode(buf.getvalue()).decode('utf-8')
                new_url = f"data:image/jpeg;base64,{new_b64}"
                if len(new_url) < len(img_url):
                    await db.products.update_one(
                        {"id": p["id"]},
                        {"$set": {"image_url": new_url}}
                    )
                    old_kb = len(img_url) / 1024
                    new_kb = len(new_url) / 1024
                    print(f"Compressed {p['name_ar']}: {old_kb:.0f}KB -> {new_kb:.0f}KB")
            except Exception as e:
                print(f"Could not compress {p.get('name_ar','')}: {e}")

# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
