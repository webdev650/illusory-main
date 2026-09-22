# Portfolio 3D Scroll Showcase & Categories Guide

This directory contains the components for the `/portfolio` 3D scroll landing page of **Illusory Design Studios**.

## Architecture & Structure

- **`PortfolioHero.tsx`**: Full-viewport intro pinned section powered by GSAP `ScrollTrigger`.
- **`ServiceRail.tsx` & `ServiceCard.tsx`**: Pinned horizontal scroll rail displaying 9 core capabilities with scroll-driven 3D tilt effects (and mobile grid fallback).
- **`WebsiteShowcase.tsx`**: Sticky 20-industry category filter bar featuring 3D depth-fade video panel transitions.
- **`CategoryDropdown.tsx`**: Responsive filter bar (scrollable pills on desktop, native dropdown on mobile).
- **`VideoPanel.tsx`**: Lazy-loaded video player (`preload="none"`), poster image fallback, play/pause controls, and client case study link overlay.

---

## Data Management

All content is data-driven to allow updating without code modifications.

### 1. Service Offerings (`frontend/data/services.json`)
Modify or add services in `frontend/data/services.json`. Schema:
```json
{
  "id": 1,
  "title": "Creative",
  "description": "Service description text..."
}
```

### 2. Industry Showcase Categories (`frontend/data/portfolio-categories.json`)
Schema for category entries:
```json
{
  "id": "cosmetic",
  "label": "Cosmetic / Beauty",
  "videoUrl": "/portfolio/cosmetic.mp4",
  "poster": "/portfolio/cosmetic-poster.jpg",
  "clientName": "Lakme",
  "projectUrl": "/works/lakme",
  "description": "Luxurious e-commerce showcase..."
}
```

---

## How to Add a New Portfolio Category & Video

1. **Prepare Media Assets**:
   - Place your video file (1080p or 4K MP4 format recommended, web-optimized) in `frontend/public/portfolio/[id].mp4`.
   - Place your poster frame image (JPG or WEBP format, ~1600px width) in `frontend/public/portfolio/[id]-poster.jpg` (or use an external Cloudinary/Unsplash image URL).

2. **Update JSON Schema**:
   - Open `frontend/data/portfolio-categories.json`.
   - Append a new item to the array following the JSON schema above.

3. **Deploy / Refresh**:
   - Save the JSON file. Next.js will automatically pick up the new category in the sticky filter bar and showcase panel.
