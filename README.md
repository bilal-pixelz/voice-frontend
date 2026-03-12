# Voice2Invoice Frontend (Next.js)

## Features
- Next.js 14 (App Router)
- Auth0 authentication (social login)
- React 18
- Axios for API calls

## Setup
1. Copy `.env.example` to `.env` and fill in your Auth0 and API details.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## Auth
- `/api/auth/login` — Auth0 login
- `/api/auth/logout` — Auth0 logout

## API
- Connects to FastAPI backend at `NEXT_PUBLIC_API_URL`
