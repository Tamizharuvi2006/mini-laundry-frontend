# Mini Laundry Frontend

Frontend application for the Mini Laundry Order Management System.

## Stack

- React
- Vite
- React Router
- Axios
- Tailwind CSS

## Features

- Admin login flow
- Dashboard with:
  - net revenue
  - refunded amount
  - per-status counts
  - net/gross chart toggle with smooth transitions
- Orders page:
  - list/search/filter
  - status update
  - quick mark delivered
  - CSV export
- Order details:
  - status timeline
  - invoice/delivery slip print/download
- Create/Edit order forms:
  - dynamic garments with add/remove
  - mobile-friendly layout

## Mobile Responsiveness

Optimized for small screens:
- responsive navbar and mobile nav items
- stacked header/actions on narrow widths
- mobile-friendly filters and form actions
- responsive dashboard chart rows

## Environment

Create `.env` from `.env.example`:

```bash
cp .env.example .env
```

`.env` value:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## Run Locally

```bash
npm install
npm run dev
```

App runs on:
- `http://localhost:5173`

## Build

```bash
npm run build
```

## Demo Credentials

- Email: `admin@laundry.com`
- Password: `admin123`

## Notes

- This frontend expects the backend API to be running.
- `.env` is gitignored; `.env.example` is committed.

## Assignment Mapping (AI-First)

This frontend is part of the internship assignment:
- Create orders
- Track order status
- Calculate billing (displayed from backend-calculated values)
- View dashboard data

Implemented in UI:
- Order create/edit flows
- Status updates and timelines
- Order list with filters/search
- Dashboard with total orders, revenue, and status distribution
- Bonus: mobile responsiveness, CSV export, invoice print view, net/gross dashboard toggle

## AI Usage Report

### Tools Used
- ChatGPT (primary)
- GitHub Copilot (optional assist)

### Sample Prompts
- "Create React pages for orders dashboard, order list, and order details for a laundry app."
- "Improve mobile responsiveness for navbar, forms, and dashboard cards."
- "Design a clean dashboard trend section for net and gross revenue views."

### Where AI Helped
- Component scaffolding
- UI flow suggestions
- Dashboard layout iteration

### What AI Got Wrong and Manual Fixes
- Some generated UI patterns were not mobile-friendly and needed restructuring.
- Refund metrics display logic required backend-aware adjustments.
- Final UX polish (button placement, chart readability, responsive behavior) was done manually.
