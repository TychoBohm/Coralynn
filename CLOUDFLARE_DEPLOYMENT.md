# Cloudflare Deployment Guide for Coralynn

## Prerequisites

- Cloudflare account with Pages enabled
- Node.js installed locally
- Wrangler CLI installed: `npm install -g wrangler`

## Setup Steps

### 1. Install Wrangler CLI

```bash
npm install -g wrangler
```

### 2. Authenticate with Cloudflare

```bash
wrangler login
```

### 3. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 4. Configure Environment Variables

Create a `.env.production` file in the frontend directory:

```
VITE_API_URL=https://your-api-domain.com
```

Replace `your-api-domain.com` with your actual backend API URL.

### 5. Build the Project

```bash
npm run build
```

This generates a `dist/` folder with the optimized production build.

### 6. Deploy to Cloudflare Pages

#### Option A: Using Wrangler CLI

```bash
wrangler pages deploy dist
```

#### Option B: Using Git Integration (Recommended)

1. Push your code to GitHub/GitLab
2. In Cloudflare Dashboard:
   - Go to Pages
   - Click "Create a project"
   - Connect your Git repository
   - Set build command: `cd frontend && npm run build`
   - Set build output directory: `frontend/dist`
   - Add environment variable `VITE_API_URL` with your backend API URL

### 7. Configure CORS on Backend

Update your FastAPI backend CORS settings in `backend/app/main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yourdomain.com", "https://*.yourdomain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Features

- **Downscaled video**: The header uses `coralynn-header-downscale.mp4` for optimal performance
- **Environment variables**: API URL is configurable via `VITE_API_URL`
- **Optimized build**: Vite ensures production-ready CSS and JavaScript

## Important Notes

- The frontend is a static site hosted on Cloudflare Pages
- Your backend API should be hosted separately (or use Cloudflare Workers)
- Make sure your backend API domain is properly configured in environment variables
- The video file will be optimized in the production build

## Troubleshooting

**API calls failing**: Ensure `VITE_API_URL` environment variable is set correctly in Cloudflare Pages settings.

**CORS errors**: Check that your backend CORS configuration includes your Cloudflare domain.

**Video not loading**: The downscale video is optimized for web. If still slow, consider using Cloudflare Stream.
