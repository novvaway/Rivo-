from fastapi import FastAPI, APIRouter, HTTPException, Query
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
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
    payment_method: str  # "cash_on_delivery" or "bank_transfer"
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


# Routes
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
    
    # Search filter
    if search:
        search_lower = search.lower()
        products = [
            p for p in products 
            if search_lower in p.get("name_ar", "").lower() 
            or search_lower in p.get("name_en", "").lower()
        ]
    
    # Sorting
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

@api_router.get("/orders", response_model=List[Order])
async def get_orders():
    orders = await db.orders.find({}, {"_id": 0}).to_list(1000)
    
    for order in orders:
        if isinstance(order.get('created_at'), str):
            order['created_at'] = datetime.fromisoformat(order['created_at'])
    
    return orders

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
