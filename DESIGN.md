# Technical Design Specification — Magic Embroidery

This document serves as the validated technical design specification and blueprint for **Magic Embroidery — It's Digital** web application, based in Selaiyur, Chennai.

---

## 1. Executive Summary
A production-ready, highly animated, and fully responsive multi-page static web application built with **React, Vite, Tailwind CSS, and Framer Motion**, configured for reliable hosting on **GitHub Pages**, and integrated with **Supabase** for secure admin content management and lead ingestion.

---

## 2. Decision Log

### Decision 1: Hosting & Routing Strategy
* **Decision**: Deployed to **GitHub Pages** using React Router’s `HashRouter` (`#/services`, `#/order`).
* **Alternatives Considered**: Vercel deployment with `BrowserRouter`, or GitHub Pages with `BrowserRouter` + `404.html` redirect script.
* **Why Chosen**: Guarantees 100% reliable page refreshes on GitHub Pages’ static hosting without complicated redirect hacks or Vercel dependencies.

### Decision 2: Admin Panel Security
* **Decision**: Admin dashboard (`#/admin`) secured via **Supabase Auth** with no public registration/sign-up forms in the frontend.
* **Alternatives Considered**: Public hidden routes (e.g., `/admin/signup-secret`) or hardcoded client auth bypass.
* **Why Chosen**: Eliminates the attack surface for unauthorized registrations. The shop administrator will manually provision their account directly inside the Supabase Auth console.

### Decision 3: Delivery Operations Model
* **Decision**: Standardized all business pipelines on **Secure Courier Delivery** for Step 3 of "How It Works".
* **Alternatives Considered**: "Doorstep Delivery".
* **Why Chosen**: Aligns with the shop's operational business model of shipping custom-tailored embroidery works via courier partners.

### Decision 4: Application State Management
* **Decision**: Lightweight, component-level isolated state powered by built-in React hooks and React Hook Form.
* **Alternatives Considered**: Redux Toolkit, Zustand, or pervasive global React Context wrappers.
* **Why Chosen**: Ruthless adherence to YAGNI (You Aren't Gonna Need It). Reduces Javascript bundle size, preventing mobile network lag and slow initial paint speeds.

---

## 3. Directory Layout
```text
src/
├── assets/             # Embroidery design svgs, floating graphics, textile backgrounds
├── components/         # Reusable modular UI components
│   ├── ui/             # Core UI tokens (buttons, inputs, labels, loaders)
│   ├── Navbar.jsx      # Sticky navigation with Framer Motion mobile drawer
│   ├── Footer.jsx      # Bottom footer with click-to-call, maps, and social tags
│   ├── ServiceCard.jsx # Staggered animated service cards
│   ├── GalleryGrid.jsx # Interactive portfolio masonry grid with category filters
│   ├── Lightbox.jsx    # Swipe-gesture-enabled image preview lightbox
│   ├── HowItWorks.jsx  # Connecting SVG animated thread-line drawing graphic
│   └── Testimonials.jsx# Swipeable customer feedback slider
├── lib/
│   └── supabase.js     # Supabase client instantiation
├── pages/              # Lazy-loaded routing views
│   ├── Home.jsx        # Landing page with hero, services, how it works, and testimonials
│   ├── Services.jsx    # Detailed view of the 6 embroidery services
│   ├── Gallery.jsx     # Masonry portfolio connected to Supabase
│   ├── Order.jsx       # Validated custom order form with reference uploads
│   ├── About.jsx       # Shop history, contact cards, and Google Maps embed
│   └── Admin.jsx       # Admin dashboard with order tables, service editing, and gallery uploads
├── App.jsx             # HashRouter and dynamic loading boundary setup
├── index.css           # Global custom typography (Playfair Display/Poppins), animation keyframes
└── main.jsx            # React root mount point
```

---

## 4. Supabase Database Schema

Run the following SQL script directly in the **Supabase SQL Editor** to initialize the required tables and security rules:

```sql
-- 1. Create Services Table
CREATE TABLE public.services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL
);

-- 2. Create Gallery Table
CREATE TABLE public.gallery (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    image_url TEXT NOT NULL,
    category TEXT NOT NULL,
    caption TEXT
);

-- 3. Create Orders Table
CREATE TABLE public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    service TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    delivery_date DATE NOT NULL,
    address TEXT NOT NULL,
    status TEXT DEFAULT 'Pending'::text NOT NULL
);

-- Enable Row Level Security (RLS) for services and gallery (public read, admin write)
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Public Read Policies
CREATE POLICY "Allow public read on services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Allow public read on gallery" ON public.gallery FOR SELECT USING (true);

-- Admin Full Access Policies (requires Supabase Auth)
CREATE POLICY "Allow admin full access on services" ON public.services 
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admin full access on gallery" ON public.gallery 
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admin full access on orders" ON public.orders 
    FOR ALL USING (auth.role() = 'authenticated');

-- Public Insert for Orders
CREATE POLICY "Allow public insert on orders" ON public.orders FOR INSERT WITH CHECK (true);
```

---

## 5. Operations & Fail-Safes
* **Supabase Disconnect**: If credentials are unset or the network fails, the system catches the query errors and loads robust local sample mock records (for services & gallery items) so the app remains visual, premium, and interactive.
* **Confetti & WhatsApp Flow**: Order submissions trigger `canvas-confetti` on success, push the data to Supabase `orders`, upload custom image references to the storage bucket `order-references`, and immediately pop open a deep-linked formatted WhatsApp thread (`https://wa.me/919994546013?text=...`) summarizing the details.
