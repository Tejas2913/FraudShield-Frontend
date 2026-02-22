================================================================================

# FraudShield AI – Frontend

The frontend is a React-based user interface that allows users to register, log in, and analyze messages using the deployed ML backend.

## Live Application
https://fraud-shield-frontend-w549.vercel.app

## Features
- User Signup & Login
- JWT token storage
- Protected routes
- Scam message analysis interface
- Responsive design
- Production deployment via Vercel

## Tech Stack
- React
- Vite
- Axios
- React Router
- Tailwind CSS (if applicable)
- Vercel (Deployment)

## Project Structure
```
src/
├── components/
├── pages/
├── services/
│   └── api.js
├── context/
├── App.jsx
├── main.jsx
vercel.json
```

## API Integration
### Backend Base URL:
- https://fraudshield-backend-6.onrender.com

Axios automatically attaches JWT token from localStorage.

## Local Development
- npm install
- npm run dev

### Frontend runs at:
- http://localhost:5173

## Production Configuration
- vercel.json enables SPA routing:
```
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

