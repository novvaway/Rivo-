# RIVO - E-Commerce Hoodie Store

## Problem Statement
E-commerce website for buying and selling hoodies named "RIVO". Arabic-primary bilingual storefront with WhatsApp-based order processing.

## Core Requirements
- Bilingual (Arabic primary, English secondary)
- Product categories: Hoodies, Polo T-shirts, Sweaters, T-shirts
- Product cards with images, tags, like button, discount badge, name, price, size/color selection, add to cart
- WhatsApp checkout (Cash on Delivery / Bank Transfer)
- Admin dashboard for CRUD product management
- Monochrome (Black/White/Gray) theme

## Architecture
- Frontend: React + TailwindCSS + Shadcn UI
- Backend: FastAPI + MongoDB
- Auth: Custom JWT
- No payment gateway (WhatsApp orders)

## Completed Features
- Full storefront with product listing, search, cart, checkout
- Admin dashboard with JWT auth
- Bilingual support (AR/EN)
- Responsive design (mobile-first)
- Theme migration: Yellow to Monochrome
- Footer with social links (Instagram, Email, WhatsApp)
- Sidebar menu
- [2026-04-01] Categories redesigned: lighter font, text label below each box, clean rounded style
- [2026-04-01] Filter/Sort dropdown restyled: centered, light border, rounded corners matching reference
- [2026-04-01] Performance: Removed Google Fonts (system fonts), image compression on upload (Pillow), lazy loading, compressed existing base64 images (24MB→435KB)

## Admin Credentials
- Email: admin@rivo.ps / Password: Rivo@Admin2024
- Alt: aziz@rivo.ps / Password: Rivo@aziz2026

## Key Files
- /app/frontend/src/components/Header.js
- /app/frontend/src/components/Categories.js
- /app/frontend/src/pages/HomePage.js
- /app/backend/server.py

## Backlog
- No pending tasks at this time
