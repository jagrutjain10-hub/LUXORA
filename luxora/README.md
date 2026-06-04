# LUXORA — Complete E-Commerce Platform

> Premium Luxury Home Décor — Production-Ready Full-Stack Application

---

## 🏗️ Project Architecture

```
luxora/
├── frontend/          # Next.js 15 (App Router) — Vercel
│   ├── src/
│   │   ├── app/               # Pages (App Router)
│   │   │   ├── page.tsx               # Homepage
│   │   │   ├── layout.tsx             # Root layout
│   │   │   ├── globals.css            # Design system CSS
│   │   │   ├── products/              # Products catalog + detail
│   │   │   ├── cart/                  # Shopping cart
│   │   │   ├── checkout/              # Multi-step checkout
│   │   │   ├── login/ register/       # Auth pages
│   │   │   ├── dashboard/             # Customer portal
│   │   │   └── admin/                 # Admin panel
│   │   ├── components/
│   │   │   ├── layout/        # Navbar, Footer
│   │   │   ├── home/          # Hero, Newsletter, etc.
│   │   │   ├── product/       # ProductCard, Reviews
│   │   │   ├── ui/            # AnimatedSection, Skeleton
│   │   │   └── Providers.tsx  # React Query, Zustand
│   │   ├── hooks/             # useProducts, useProduct, etc.
│   │   ├── lib/               # API client (axios), utils
│   │   ├── store/             # Zustand: cart, wishlist, auth
│   │   └── types/             # TypeScript types
│   ├── tailwind.config.ts     # Full LUXORA design tokens
│   ├── next.config.ts
│   └── .env.example
│
└── backend/           # Node.js + Express — Render
    ├── src/
    │   ├── controllers/       # Auth, Products, Orders, Payments, Admin
    │   ├── middleware/        # Auth JWT, Error handler, Rate limit
    │   ├── routes/            # All API route definitions
    │   ├── services/          # Email service (templates)
    │   ├── utils/             # JWT, AppError, Logger, Helpers
    │   └── config/            # Prisma client, Env validation
    ├── prisma/
    │   └── schema.prisma      # Complete database schema
    └── .env.example
```

---

## 🗄️ Database Schema (PostgreSQL)

### Core Models
| Model         | Description                                      |
|---------------|--------------------------------------------------|
| `User`        | Customers + Admins with JWT auth                |
| `Address`     | Multiple saved addresses per user               |
| `Category`    | Product categories with slugs                   |
| `Product`     | Full catalog with pricing, stock, SEO           |
| `ProductImage`| Multiple images per product, sortable           |
| `Review`      | Verified purchase reviews with ratings          |
| `CartItem`    | Persistent cart (user + guest session)          |
| `WishlistItem`| User wishlists                                  |
| `Order`       | Full order with status lifecycle                |
| `OrderItem`   | Line items with price snapshot                  |
| `Payment`     | Razorpay gateway integration                    |

### Order Status Flow
```
PENDING → CONFIRMED → PACKED → SHIPPED → DELIVERED
                                        ↘ CANCELLED / REFUNDED
```

---

## 🔌 REST API Reference

### Auth  `POST /api/v1/auth/`
| Endpoint                        | Method | Auth | Description                |
|---------------------------------|--------|------|----------------------------|
| `/register`                     | POST   | —    | Create account             |
| `/verify-email/:token`          | GET    | —    | Verify email address       |
| `/login`                        | POST   | —    | Login, returns JWT         |
| `/refresh`                      | POST   | 🍪   | Refresh access token       |
| `/logout`                       | POST   | ✅   | Logout, clear session      |
| `/forgot-password`              | POST   | —    | Send reset link            |
| `/reset-password/:token`        | POST   | —    | Reset with token           |

### Products  `GET/POST /api/v1/products/`
| Endpoint          | Method | Auth        | Description                 |
|-------------------|--------|-------------|-----------------------------|
| `/`               | GET    | —           | List with filters + pagination |
| `/:slug`          | GET    | —           | Product detail + related    |
| `/`               | POST   | 🔐 Admin    | Create product              |
| `/:id`            | PUT    | 🔐 Admin    | Update product              |
| `/:id`            | DELETE | 🔐 Admin    | Soft delete                 |
| `/bulk`           | POST   | 🔐 Admin    | Bulk create                 |

**Query Params (GET /):**
- `page`, `limit` — pagination
- `category` — category slug
- `search` — full-text search
- `sort` — `price | createdAt | name`
- `order` — `asc | desc`
- `minPrice`, `maxPrice` — price range
- `featured=true`, `bestSeller=true`

### Orders  `GET/POST /api/v1/orders/`
| Endpoint            | Method | Auth        | Description          |
|---------------------|--------|-------------|----------------------|
| `/`                 | POST   | ✅ User     | Create order         |
| `/my`               | GET    | ✅ User     | List user orders     |
| `/my/:id`           | GET    | ✅ User     | Order detail         |
| `/`                 | GET    | 🔐 Admin    | All orders           |
| `/:id/status`       | PATCH  | 🔐 Admin    | Update status        |
| `/export`           | GET    | 🔐 Admin    | Export to Excel      |

### Payments  `POST /api/v1/payments/`
| Endpoint                | Method | Auth        | Description            |
|-------------------------|--------|-------------|------------------------|
| `/razorpay/create`      | POST   | ✅ User     | Create Razorpay order  |
| `/razorpay/verify`      | POST   | ✅ User     | Verify payment         |
| `/razorpay/webhook`     | POST   | —           | Razorpay webhook       |

### Admin  `GET /api/v1/admin/`
| Endpoint              | Method | Auth        | Description           |
|-----------------------|--------|-------------|-----------------------|
| `/dashboard`          | GET    | 🔐 Admin    | Stats + charts data   |
| `/inventory-alerts`   | GET    | 🔐 Admin    | Low stock products    |

### Upload  `POST /api/v1/upload/`
| Endpoint    | Method | Auth        | Description              |
|-------------|--------|-------------|--------------------------|
| `/image`    | POST   | ✅ Any      | Upload single image      |
| `/images`   | POST   | ✅ Any      | Upload multiple images   |

---

## 🔐 Security Implementation

### Authentication Flow
```
1. User registers → hashed password (bcrypt, 12 rounds)
2. Email verification token sent (SHA-256 hashed in DB)
3. Login → access token (15min) + refresh token (7d, httpOnly cookie)
4. API requests → Bearer token in Authorization header
5. Token refresh → sliding window, rotates refresh token
6. Logout → refresh token cleared from DB + cookie
```

### Security Layers
- **Helmet** — HTTP security headers
- **CORS** — whitelist only configured origins
- **Rate Limiting** — 200 req/15min global, 10 req/15min on auth
- **Input Validation** — Zod schemas on all endpoints
- **SQL Injection** — Prisma parameterized queries
- **XSS** — Input sanitization + CSP headers
- **CSRF** — SameSite cookie policy
- **Password Reset** — SHA-256 hashed tokens, 1hr expiry
- **JWT** — RS256, issuer validation, short-lived access tokens

---

## 🚀 Deployment

### Prerequisites
- Node.js 20+
- PostgreSQL 15+
- npm or pnpm

### Local Setup

#### 1. Clone & install
```bash
# Backend
cd luxora/backend
cp .env.example .env       # Fill in your values
npm install
npx prisma generate
npx prisma migrate dev --name init
npx ts-node prisma/seed.ts  # Optional: seed sample data
npm run dev

# Frontend
cd luxora/frontend
cp .env.example .env.local  # Fill in your values
npm install
npm run dev
```

#### 2. Required env variables (minimum)
```bash
# Backend .env
DATABASE_URL=postgresql://...
JWT_ACCESS_SECRET=<32+ char random string>
JWT_REFRESH_SECRET=<32+ char random string>
COOKIE_SECRET=<16+ char random string>
SMTP_HOST=smtp.gmail.com
SMTP_USER=your@gmail.com
SMTP_PASS=your-app-password

# Frontend .env.local
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

---

### Production: Backend → Render

1. Create **Web Service** on [render.com](https://render.com)
2. Connect your Git repo, select `luxora/backend` as root
3. **Build Command:** `npm install && npx prisma generate && npm run build`
4. **Start Command:** `npx prisma migrate deploy && npm start`
5. Add **PostgreSQL Database** from Render (copy `DATABASE_URL`)
6. Add all environment variables from `.env.example`

**Render `render.yaml`:**
```yaml
services:
  - type: web
    name: luxora-api
    env: node
    region: singapore
    plan: starter
    buildCommand: npm install && npx prisma generate && npm run build
    startCommand: npx prisma migrate deploy && npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        fromDatabase:
          name: luxora-db
          property: connectionString

databases:
  - name: luxora-db
    databaseName: luxora
    user: luxora
    region: singapore
    plan: starter
```

---

### Production: Frontend → Vercel

1. Import repo at [vercel.com](https://vercel.com)
2. Set **Root Directory** to `luxora/frontend`
3. **Framework:** Next.js (auto-detected)
4. Add environment variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-api.onrender.com/api/v1
   NEXT_PUBLIC_SITE_URL=https://luxora.in
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxx
   ```
5. Deploy — Vercel handles builds, CDN, and SSL automatically

---

## 🎨 Design System

### Colors (Tailwind tokens)
| Token           | Hex       | Usage                          |
|-----------------|-----------|--------------------------------|
| `obsidian`      | `#0a0a0a` | Primary dark, backgrounds      |
| `champagne-500` | `#c9a96e` | Gold accent, CTAs, icons       |
| `ivory-DEFAULT` | `#f5f0e8` | Light backgrounds              |
| `sand-DEFAULT`  | `#e8dfd0` | Borders, subtle backgrounds    |

### Typography
| Family       | Variable          | Usage                    |
|--------------|-------------------|--------------------------|
| Cormorant    | `--font-cormorant`| Display headings, prices |
| Jost         | `--font-jost`     | Body text, UI labels     |
| DM Mono      | `--font-dm-mono`  | SKUs, order numbers      |

### Component Classes
```css
.btn-primary      /* Obsidian bg, ivory text, hover → gold */
.btn-secondary    /* Outlined, hover → obsidian fill */
.btn-ghost        /* Gold border, hover → gold fill */
.input-luxury     /* Borderless bottom border, champagne focus */
.card-product     /* Hover shadow, image scale + secondary image reveal */
.label-gold       /* Uppercase, wide tracking, champagne color */
.skeleton         /* Loading shimmer with gold gradient */
```

---

## 📦 Key Features Checklist

### Frontend ✅
- [x] Luxury homepage with parallax hero
- [x] Category-filtered product catalog with URL state
- [x] Product detail with zoom modal + image gallery
- [x] Persistent cart (Zustand + localStorage)
- [x] Wishlist (persisted)
- [x] Multi-step checkout with Razorpay
- [x] JWT auth with silent token refresh
- [x] Customer dashboard (orders, profile, wishlist, addresses)
- [x] Admin dashboard with revenue charts
- [x] Admin product management (CRUD + image upload)
- [x] Admin order management with status updates + Excel export
- [x] Responsive: mobile → tablet → desktop → 4K
- [x] Framer Motion animations throughout
- [x] Skeleton loaders for all async content
- [x] SEO: metadata, OpenGraph, schema ready

### Backend ✅
- [x] JWT auth with refresh token rotation
- [x] Email verification + password reset via email
- [x] Bcrypt password hashing (12 rounds)
- [x] Rate limiting (global + auth-specific)
- [x] Helmet security headers
- [x] Prisma ORM with PostgreSQL
- [x] Full product CRUD with image management
- [x] Order lifecycle management
- [x] Razorpay payment integration with webhook verification
- [x] Admin analytics dashboard
- [x] Excel order export
- [x] Image upload with Sharp optimization
- [x] Transactional stock management
- [x] Structured logging with Winston
- [x] Zod input validation
- [x] Graceful error handling

---

## 🔧 Extending the Platform

### Add a new payment gateway
1. Add new `PaymentMethod` enum value in `schema.prisma`
2. Create controller in `payment.controller.ts`
3. Add route in `payment.routes.ts`
4. Add UI option in `checkout/page.tsx`

### Add a new product category
1. Insert via admin panel or Prisma seed
2. Add to `CATEGORIES` arrays in frontend components
3. No code changes needed for API (dynamic)

### Configure Cloudinary (recommended for production)
```typescript
// In upload.controller.ts, replace processAndSaveImage with:
import { v2 as cloudinary } from 'cloudinary';
cloudinary.config({ cloud_name, api_key, api_secret });

const result = await new Promise((resolve, reject) => {
  cloudinary.uploader.upload_stream(
    { folder: 'luxora/products', quality: 'auto', format: 'webp' },
    (err, result) => err ? reject(err) : resolve(result)
  ).end(buffer);
});
return result.secure_url;
```

---

## 📊 Performance Targets

| Metric            | Target  | Strategy                               |
|-------------------|---------|----------------------------------------|
| LCP               | < 2.5s  | SSR, next/image, priority loading      |
| FID               | < 100ms | Code splitting, lazy imports           |
| CLS               | < 0.1   | Skeleton loaders, aspect-ratio CSS     |
| Bundle Size       | < 200KB | Tree shaking, dynamic imports          |
| API Response      | < 200ms | DB indexing, caching, connection pool  |

---

*Built with ❤️ for LUXORA — Luxury Home Décor*
