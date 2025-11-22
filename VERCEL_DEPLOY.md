## Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fitshae43%2FFusionAI)

### One-Click Setup

1. Click "Deploy" button above
2. Connect your GitHub account
3. Add environment variables when prompted
4. Deploy!

### Required Environment Variables

Set these in Vercel during deployment:

```env
GROQ_API_KEY=
E2B_API_KEY=
EXA_API_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

### Health Check

After deployment, verify all services are configured:
```
https://your-app.vercel.app/api/health
```

Expected response:
```json
{
  "status": "ok",
  "checks": {
    "groq": true,
    "e2b": true,
    "exa": true,
    "supabase": true,
    "supabaseAdmin": true
  }
}
```

If any check is `false`, that environment variable is missing.

### Full Guide

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment instructions.
