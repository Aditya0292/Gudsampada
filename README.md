# GudSampada E-Commerce

Welcome to the GudSampada web application. This project is a premium e-commerce storefront for traditionally crafted, unrefined jaggery products from Kolhapur, Maharashtra.

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **UI & Styling**: Tailwind CSS 4, custom CSS variables for design tokens (molasses, gold, cream)
- **Animation**: Framer Motion for scroll effects, page transitions, and micro-interactions
- **Smooth Scrolling**: Lenis (Zustand for state)
- **State Management**: Zustand (Cart State)
- **Language**: TypeScript

## Project Overview & Design Philosophy

GudSampada is designed with a premium, editorial aesthetic inspired by modern heritage brands.
The design utilizes:
- **Typography**: A mix of modern Sans-Serif (`Inter`) for structure/data and elegant Serif (`Playfair Display`) for expressive headings and storytelling.
- **Color Palette**: Rich, earthy tones mirroring sugarcane and jaggery: 
  - `molasses` (deep rich brown)
  - `gold` (warm accent)
  - `cream` (soft background)
  - `terracotta` and `forest` for accents.
- **Layouts**: Asymmetrical grids, clean brutalist borders, generous whitespace, and center-anchor focus elements.
- **Interaction**: Deliberately stripped of standard web hover effects (no background/color shifting on hover) in favor of static, confident typography and purposeful layout structures.

---

## Detailed Implementation Log

Below is a summary of the work that has been completed and refined up to this point:

### 1. The Home Page & Hero Section
- **Premium Hero Section**: Features a full-height layout with a parallax sugarcane field background. A dark left-to-right gradient overlay ensures stark contrast for the white and champagne gold typography.
- **Rotating Product Showcase**: Implemented a rotating showcase (every 8 seconds) in the Hero Section. 
  - Showcases the Ginger Jaggery Powder and Paan Jaggery Bites.
  - The image size is upscaled significantly to anchor the right side of the screen (`max-w-[460px]`).
  - Removed initial glassmorphism backgrounds to let the products cleanly float over the imagery with a deep 3D drop-shadow.
- **Micro-Animations**: Framer Motion handles smooth crossfades on the hero rotating products and scroll-reveal effects on grid items.

### 2. Product Details Page (PDP)
- **3-Column Center-Anchor Layout**:
  - **Left**: Story blocks detailing product origin, taste profiles, and traditional methods (with clean 1px stroke SVG icons).
  - **Center**: The hero product image anchored with an authentic CSS-based 3D floor shadow (`drop-shadow` effects) sitting over a massive typographic background watermark.
  - **Right**: Commerce controls featuring clean typography, brutalist size selectors, and an oversized `Add to Cart` CTA.
- **Layered Watermark**: Added a massive editorial background watermark. The product prefix (e.g. "GINGER") sits at 20vw size in ultra-light opacity, with an overlapping elegant italic serif text (e.g. "jaggery powder").
- **Content Upgrades**: Upgraded the product data (`src/data/products.ts`) from simple one-word benefits to elegant, descriptive full-sentence benefits for a premium storytelling experience.
- **Refinements**:
  - Re-justified description and how-to-use texts for a clean editorial look.
  - Removed unnecessary elements like the "Easy Returns" badge and floating tags on the hero image to declutter the layout.

### 3. Shop & Commerce Experience
- **Header & Navigation**: Fixed layout paddings and centered the shop header elements perfectly. Subpage offset classes (`.main-page-padding`) were added globally to handle fixed header overlap.
- **Product Cards**: Implemented a 4:5 aspect ratio image wrapper. Fixed image padding handling so transparent cutout images (`aaa-removebg-preview.png`) scale correctly inside the card container via `object-contain` and direct image padding.
- **Cart Drawer**: 
  - Created a smooth animated side-drawer cart.
  - Transformed heavy solid buttons into clean, bold typographic links with gliding arrows for actions like "Start Shopping" and "Checkout".
- **Checkout / WhatsApp Integration**: 
  - Formatted the checkout flow to end in WhatsApp orders.
  - Upgraded checkout action buttons into clean typographic links matching the site-wide brutalist/typographic aesthetic.

### 4. Site-Wide Adjustments
- **Hover-Effect Sweeps**: Performed a massive codebase sweep to remove standard utility hover effects (`hover:`, `group-hover:`) globally. The UI is now strictly static on interaction, avoiding cheap zooming or color-flash effects and reinforcing a high-end feel.
- **TypeScript Strictness**: Maintained 100% type safety throughout the development process, verified continually via `npx tsc --noEmit`.

## Running the Project

```bash
# Install dependencies
npm install

# Run the development server
npm run dev

# Build for production
npm run build
```
