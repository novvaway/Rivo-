import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

products = [
    {
        "id": "prod-1",
        "name_ar": "هودي لوس أنجلوس",
        "name_en": "Los Angeles Hoodie",
        "category": "HOODIES",
        "price": 80.0,
        "old_price": 100.0,
        "discount_percent": 20,
        "image_url": "https://customer-assets.emergentagent.com/job_b1f4aa7c-ac0f-4227-b998-5810aa23b5b1/artifacts/tim1umsq_1000319271.jpg",
        "stickers": ["COMFORT", "IDENTITY"],
        "sizes": ["S", "M", "L", "XL", "XXL"],
        "colors": ["أسود", "أبيض", "رمادي"],
        "description_ar": "هودي عصري بتصميم أنيق ومريح للارتداء اليومي",
        "description_en": "Modern hoodie with elegant design, comfortable for daily wear",
        "in_stock": True
    },
    {
        "id": "prod-2",
        "name_ar": "هودي أساسي",
        "name_en": "Essential Pullover",
        "category": "HOODIES",
        "price": 75.0,
        "old_price": 90.0,
        "discount_percent": 17,
        "image_url": "https://customer-assets.emergentagent.com/job_b1f4aa7c-ac0f-4227-b998-5810aa23b5b1/artifacts/w5jto8lq_1000319270.jpg",
        "stickers": ["COMFORT"],
        "sizes": ["S", "M", "L", "XL", "XXL"],
        "colors": ["أبيض", "أزرق", "أسود"],
        "description_ar": "هودي كلاسيكي مثالي لجميع المواسم",
        "description_en": "Classic hoodie perfect for all seasons",
        "in_stock": True
    },
    {
        "id": "prod-3",
        "name_ar": "بولو وردي حضري",
        "name_en": "Urban Pink Polo",
        "category": "POLO T-SHIRTS",
        "price": 60.0,
        "old_price": None,
        "discount_percent": None,
        "image_url": "https://images.pexels.com/photos/17984123/pexels-photo-17984123.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "stickers": ["IDENTITY"],
        "sizes": ["S", "M", "L", "XL"],
        "colors": ["وردي", "أزرق", "أسود"],
        "description_ar": "قميص بولو أنيق للإطلالة الكاجوال",
        "description_en": "Elegant polo shirt for casual look",
        "in_stock": True
    },
    {
        "id": "prod-4",
        "name_ar": "سويتر ليلي",
        "name_en": "Night Knit Sweater",
        "category": "SWEATERS",
        "price": 110.0,
        "old_price": 130.0,
        "discount_percent": 15,
        "image_url": "https://images.unsplash.com/photo-1618924250456-0c7d405f2d53?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NTJ8MHwxfHNlYXJjaHwyfHxzdHJlZXR3ZWFyJTIwc3dlYXRlciUyMG1vZGVsfGVufDB8fHx8MTc3NDk3OTI4NXww&ixlib=rb-4.1.0&q=85",
        "stickers": ["COMFORT"],
        "sizes": ["M", "L", "XL", "XXL"],
        "colors": ["أسود", "كحلي", "رمادي"],
        "description_ar": "سويتر دافئ ومريح للأجواء الباردة",
        "description_en": "Warm and comfortable sweater for cold weather",
        "in_stock": True
    },
    {
        "id": "prod-5",
        "name_ar": "تيشيرت أسود واسع",
        "name_en": "Oversized Black Tee",
        "category": "T-SHIRTS",
        "price": 45.0,
        "old_price": None,
        "discount_percent": None,
        "image_url": "https://images.unsplash.com/photo-1768696082704-c4e5593d9f27?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NzV8MHwxfHNlYXJjaHwyfHxibGFjayUyMHQtc2hpcnQlMjBzdHJlZXR3ZWFyJTIwbW9kZWx8ZW58MHx8fHwxNzc0OTc5MzA1fDA&ixlib=rb-4.1.0&q=85",
        "stickers": ["IDENTITY", "NEW"],
        "sizes": ["S", "M", "L", "XL", "XXL"],
        "colors": ["أسود", "أبيض", "رمادي"],
        "description_ar": "تيشيرت واسع بقصّة عصرية",
        "description_en": "Oversized tee with modern cut",
        "in_stock": True
    },
    {
        "id": "prod-6",
        "name_ar": "هودي رياضي",
        "name_en": "Sport Hoodie",
        "category": "HOODIES",
        "price": 95.0,
        "old_price": 120.0,
        "discount_percent": 21,
        "image_url": "https://images.unsplash.com/photo-1627135345338-a2024b1aea9d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NzR8MHwxfHNlYXJjaHw0fHxzdHJlZXR3ZWFyJTIwaG9vZGllJTIwbW9kZWwlMjBpc29sYXRlZHxlbnwwfHx8fDE3NzQ5NzkyODN8MA&ixlib=rb-4.1.0&q=85",
        "stickers": ["COMFORT"],
        "sizes": ["M", "L", "XL"],
        "colors": ["أسود", "رمادي"],
        "description_ar": "هودي رياضي بجودة عالية",
        "description_en": "High quality sport hoodie",
        "in_stock": True
    }
]

async def seed_products():
    # Clear existing products
    await db.products.delete_many({})
    
    # Insert new products
    if products:
        await db.products.insert_many(products)
    
    print(f"✅ تم إدخال {len(products)} منتج بنجاح")
    
async def main():
    await seed_products()
    client.close()

if __name__ == "__main__":
    asyncio.run(main())
