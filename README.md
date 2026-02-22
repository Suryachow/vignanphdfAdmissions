# PhD Admissions Student Portal (Vignan University)

This is the frontend portal for the Vignan PhD Admissions system. It provides a multi-step registration flow, OTP verification, and payment integration.

## 🚀 Quick Start (Local)

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Setup**:
   Copy `.env.example` to `.env` and update the `VITE_API_URL`.

3. **Run Dev Server**:
   ```bash
   npm run dev
   ```

## ☁️ Production Deployment

This project is optimized for deployment on **AWS EC2 (Instance 1)** using Nginx.

- **Setup Script**: `deployment/setup_frontend.sh`
- **Nginx Config**: `deployment/nginx.conf`
- **Build Command**: `npm run build`

Refer to `PROJECT_HANDOVER.md` in the root for full architectural details.

## 🛠 Tech Stack
- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS 4, Framer Motion
- **Services**: Axios, Lucide Icons
