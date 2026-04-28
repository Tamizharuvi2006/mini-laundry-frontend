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
