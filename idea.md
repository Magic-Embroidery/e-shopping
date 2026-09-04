Build a production-ready multi-page ecommerce website for "Magic Embroidery — It's Digital", 
a digital embroidery tailor shop based in Selaiyur, Chennai 73.

=======================================================
BRAND IDENTITY
=======================================================
Shop Name     : Magic Embroidery — It's Digital
Tagline       : "We will provide the best and reliable digital embroidery"
Location      : Selaiyur, Chennai 73
Phone         : 99945 46013
Instagram     : @magicembroidery_digital
Google Maps   : https://maps.app.goo.gl/RHngweEYyT6YM1Vz7
WhatsApp Link : https://wa.me/919994546013

COLOR PALETTE (extracted from brand card):
  --color-bg         : #F5DDD8   (soft blush pink background)
  --color-primary    : #C0305A   (deep rose/magenta — CTA buttons, accents)
  --color-secondary  : #7B2D8B   (rich purple — headings, highlights)
  --color-text-dark  : #4A1040   (dark plum — body text)
  --color-accent     : #E8A0B0   (light pink — hover states, borders)
  --color-white      : #FFFFFF
  --color-card-bg    : #FDF0ED   (very light blush for cards)

FONTS (Google Fonts):
  Headings : "Playfair Display" (serif, elegant)
  Body     : "Poppins" (clean, modern)

=======================================================
TECH STACK
=======================================================
- React + Vite
- Tailwind CSS (with custom color config using above palette)
- Framer Motion (heavy use for animations)
- React Router DOM (multi-page routing)
- React Hook Form (contact/order form)
- Supabase (admin panel + product/order management)
- react-hot-toast (notifications)
- lucide-react (icons)

=======================================================
PAGES
=======================================================

1. HOME PAGE (/)
   - Animated hero section: large heading fades + slides in, sewing machine 
     illustration floats with CSS keyframe, flower petal particles falling 
     in background (CSS animation), CTA buttons "Order on WhatsApp" + 
     "View Our Work"
   - Marquee ticker: scrolling text banner "Blouse Embroidery • Bridal Work 
     • Logo Embroidery • Saree Work • Name Embroidery •"
   - Services grid (6 cards, staggered Framer Motion entrance):
       • Blouse Embroidery
       • Bridal Blouse Embroidery
       • Logo Embroidery
       • Initial & Name Embroidery
       • Burka Alteration & Embroidery
       • Saree Embroidery
     Each card: icon, title, short description, hover lift + glow effect
   - "How It Works" — 3 steps with connecting animated thread line between them:
       1. Choose Your Design
       2. Place Order via WhatsApp
       3. Doorstep Delivery
   - Gallery preview (6 items, masonry grid, hover zoom reveal)
   - Testimonials carousel (auto-scroll, pause on hover)
   - Instagram CTA banner: "Follow us @magicembroidery_digital"
   - WhatsApp floating button (fixed bottom-right, pulse animation)

2. SERVICES PAGE (/services)
   - Full detailed cards for all 6 services
   - Each card: hero image placeholder, description, "Order This" WhatsApp 
     deep link button
   - Framer Motion: cards animate in on scroll

3. GALLERY PAGE (/gallery)
   - Masonry image grid (use https://picsum.photos placeholders sized 
     400x500, 400x300 alternating)
   - Lightbox on click (use yet-another-react-lightbox)
   - Filter tabs: All / Blouse / Bridal / Saree / Logo / Name
   - Images loaded from Supabase "gallery" table

4. ORDER PAGE (/order)
   - Custom order form with React Hook Form + validation:
       • Customer Name (required)
       • Phone Number (required, 10-digit validation)
       • Service Type (dropdown: all 6 services)
       • Design Description (textarea)
       • Reference Image Upload (file input, preview before submit)
       • Preferred Delivery Date (date picker)
       • Address (textarea)
   - On submit: save to Supabase "orders" table + open WhatsApp with 
     pre-filled message summarizing the order
   - WhatsApp message format:
     "Hello Magic Embroidery! 🧵
      Name: {name}
      Phone: {phone}
      Service: {service}
      Description: {description}
      Delivery by: {date}
      Address: {address}"
   - Success animation: confetti burst on form submit

5. ABOUT PAGE (/about)
   - Shop story section
   - Why choose us: 4 feature cards (Quality Thread, Digital Precision, 
     Fast Delivery, Affordable Price)
   - Google Maps embed (iframe from the Maps link)
   - Contact info card with click-to-call + WhatsApp buttons

6. ADMIN PAGE (/admin) — PROTECTED
   - Supabase Auth login (email + password)
   - Dashboard tabs:
       • Orders — table of all submitted orders, status update 
         (Pending / In Progress / Completed), mark as done
       • Gallery — upload new images, delete existing, tag by category
       • Services — edit service name, description, image
   - All changes reflect live on the public site via Supabase real-time

=======================================================
NAVBAR
=======================================================
- Logo: "Magic Embroidery" in Playfair Display with a sewing machine icon
- Links: Home | Services | Gallery | Order Now | About
- "Order Now" is a filled pill button in --color-primary
- Mobile: hamburger menu, slide-in drawer with Framer Motion
- Scroll behavior: navbar becomes solid white with shadow after 80px scroll

=======================================================
FOOTER
=======================================================
- Logo + tagline
- Quick links
- Services list
- Contact: phone (click-to-call), Instagram link, Google Maps link
- WhatsApp CTA button
- Copyright: "© 2025 Magic Embroidery. All rights reserved."

=======================================================
ANIMATIONS (Framer Motion — HIGH PRIORITY)
=======================================================
- Page transition: each route fades + slides up on enter
- Hero heading: word-by-word staggered reveal
- Service cards: staggered cascade from bottom on scroll enter
- Gallery images: scale from 0.8 + fade on scroll
- "How It Works" thread line: SVG path draw animation (pathLength)
- Floating WhatsApp button: heartbeat pulse CSS animation
- Marquee ticker: infinite smooth scroll
- Form submit: confetti particles on success
- Navbar: smooth underline slide on active link
- Hover on all cards: translateY(-8px) + box-shadow glow in --color-accent

=======================================================
SUPABASE SCHEMA
=======================================================

Table: orders
  id            uuid primary key
  created_at    timestamp
  name          text
  phone         text
  service       text
  description   text
  image_url     text (optional upload)
  delivery_date date
  address       text
  status        text default 'Pending'

Table: gallery
  id            uuid primary key
  created_at    timestamp
  image_url     text
  category      text
  caption       text

Table: services
  id            uuid primary key
  name          text
  description   text
  image_url     text

=======================================================
ENVIRONMENT VARIABLES (.env)
=======================================================
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

=======================================================
FOLDER STRUCTURE
=======================================================
src/
  pages/
    Home.jsx
    Services.jsx
    Gallery.jsx
    Order.jsx
    About.jsx
    Admin.jsx
  components/
    Navbar.jsx
    Footer.jsx
    ServiceCard.jsx
    GalleryGrid.jsx
    Lightbox.jsx
    OrderForm.jsx
    Testimonials.jsx
    HowItWorks.jsx
    WhatsAppButton.jsx
    AdminOrders.jsx
    AdminGallery.jsx
    AdminServices.jsx
  lib/
    supabase.js
  App.jsx
  main.jsx
public/
  favicon (sewing machine icon)

  =======================================================
RESPONSIVE DESIGN — ALL SCREENS (MANDATORY)
=======================================================

BREAKPOINTS (Tailwind config):
  xs  : 320px   (small budget Android phones)
  sm  : 480px   (mid-range phones)
  md  : 768px   (tablets, iPads)
  lg  : 1024px  (laptops)
  xl  : 1280px  (desktops)
  2xl : 1536px  (large monitors)

NAVBAR:
  - Mobile (< 768px)  : hamburger icon, full-screen slide-in drawer 
                        with Framer Motion, closes on outside click
  - Tablet (768–1024) : condensed links, smaller font
  - Desktop (> 1024px): full horizontal nav with hover underline effect

HERO SECTION:
  - Mobile  : stacked layout, heading 32px, single column, 
               CTA buttons full width stacked
  - Tablet  : heading 48px, buttons side by side
  - Desktop : heading 64px, split layout (text left, illustration right)

SERVICES GRID:
  - Mobile  : 1 column
  - Tablet  : 2 columns
  - Desktop : 3 columns

GALLERY GRID:
  - Mobile  : 2 columns, no masonry (equal height)
  - Tablet  : 3 columns, masonry enabled
  - Desktop : 4 columns, masonry with hover zoom

HOW IT WORKS:
  - Mobile  : vertical stacked steps, no connecting line
  - Tablet+ : horizontal 3-step layout with animated SVG thread line

TESTIMONIALS:
  - Mobile  : single card, swipe gesture (touch events)
  - Tablet+ : 2 cards visible, auto-scroll carousel

ORDER FORM:
  - Mobile  : single column, full-width inputs, large tap targets (min 48px)
  - Tablet+ : 2-column layout for name/phone and date/service fields

ADMIN PANEL:
  - Mobile  : tab navigation at bottom, stacked table rows as cards
  - Desktop : sidebar navigation, full data table view

FOOTER:
  - Mobile  : single column stacked
  - Tablet  : 2 columns
  - Desktop : 4 columns side by side

TYPOGRAPHY SCALING:
  - h1 : text-3xl → text-4xl → text-6xl
  - h2 : text-2xl → text-3xl → text-4xl
  - h3 : text-xl  → text-2xl → text-3xl
  - body: text-sm → text-base → text-lg

TOUCH & MOBILE UX:
  - All tap targets minimum 48x48px
  - Swipe support on gallery lightbox and testimonials carousel
  - No hover-only interactions on mobile
  - Inputs: font-size minimum 16px (prevents iOS auto-zoom)
  - WhatsApp floating button: bottom-right on desktop, 
    bottom-center on mobile with larger tap area
  - Smooth scroll behavior on all anchor links

IMAGES:
  - Use srcSet with multiple resolutions
  - Lazy load all gallery images (loading="lazy")
  - Aspect ratio locked containers to prevent layout shift (CLS)

PERFORMANCE:
  - React.lazy() + Suspense for all page components
  - Image compression before Supabase upload (use browser-image-compression)
  - Skeleton loaders on gallery and orders table

=======================================================
ADDITIONAL NOTES
=======================================================
- All prices hidden (order via WhatsApp only — no cart needed)
- Mobile-first, fully responsive (Chennai audience = mostly mobile users)
- WhatsApp button always visible on every page
- Use react-router-dom v6 with lazy loading per page
- Add loading skeleton screens for gallery and orders
- SEO: add react-helmet with meta tags per page
- Deploy target: Vercel (add vercel.json config)

