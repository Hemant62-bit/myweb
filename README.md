# HPL Digital Solution & Automation — full website

    backend/   FastAPI + MongoDB  (deploy on Render / Railway)
    frontend/  Vite + React 19 + TypeScript + Tailwind v4  (deploy on Cloudflare Pages)

## 1. Local run
Backend:
    cd backend && python -m venv venv && source venv/bin/activate
    pip install -r requirements.txt
    cp .env.example .env        # fill MONGO_URL, JWT_SECRET, ADMIN_PASSWORD
    python seed.py              # sample services / FAQs / testimonials
    uvicorn server:app --port 8001 --reload
Frontend:
    cd frontend && npm install && npm run dev      # http://localhost:3000
Admin: /admin/login  (ADMIN_USERNAME / ADMIN_PASSWORD from .env; password change forced at first login)

## 2. GitHub
    git init && git add . && git commit -m "HPL website" && git branch -M main
    git remote add origin https://github.com/USERNAME/REPO.git && git push -u origin main

## 3. Database: MongoDB Atlas (free M0) -> copy connection string into MONGO_URL.
   In Atlas > Network Access allow 0.0.0.0/0 (or Render's IPs).

## 4. Backend on Render
   New > Web Service > connect GitHub repo > Root Directory: backend
   Build: pip install -r requirements.txt      Start: uvicorn server:app --host 0.0.0.0 --port $PORT
   Environment variables: copy everything from backend/.env.example (real values).
   Custom domain: api.hpldigi.in  (then COOKIE_SAMESITE=lax, COOKIE_SECURE=true)
   Run seed once: Render Shell > `python seed.py`
   Note: Render free disk is ephemeral, so admin image uploads are lost on redeploy (use a paid disk or cloud storage later).

## 5. Frontend on Cloudflare Pages
   Workers & Pages > Create > Pages > **Connect to Git** (not "Upload")
   Root directory: frontend   Build command: npm run build   Output directory: dist
   Environment variable: VITE_API_URL = https://api.hpldigi.in/api
   Custom domain: www.hpldigi.in
   Without a custom api domain (onrender.com + pages.dev): set backend COOKIE_SAMESITE=none, COOKIE_SECURE=true,
   CORS_ORIGINS to your pages.dev URL.

## 6. Images
   frontend/public/brand/*.jpg are placeholders. Replace with your real photos (same file names).
