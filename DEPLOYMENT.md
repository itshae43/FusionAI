# Fusion AI - Vercel Deployment Guide

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **API Keys**: Get the following API keys ready:
   - Groq API Key (for LLM): https://console.groq.com
   - E2B API Key (for code execution): https://e2b.dev
   - Exa API Key (for research): https://exa.ai
   - Supabase credentials: https://supabase.com

## Deployment Steps

### 1. Push to GitHub

```bash
git add .
git commit -m "Ready for production deployment"
git push origin main
```

### 2. Import to Vercel

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Framework Preset: **Next.js** (auto-detected)
4. Root Directory: `./` (leave default)

### 3. Configure Environment Variables

In Vercel project settings → Environment Variables, add:

#### Required Variables:

```
GROQ_API_KEY=your_groq_api_key
E2B_API_KEY=your_e2b_api_key
EXA_API_KEY=your_exa_api_key
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

#### Optional Variables:
```
BROWSERBASE_API_KEY=your_browserbase_key
BROWSERBASE_PROJECT_ID=your_project_id
GEMINI_API_KEY=your_gemini_key
```

**Important**: Make sure to set these for **Production**, **Preview**, and **Development** environments.

### 4. Deploy

Click **Deploy** - Vercel will automatically:
- Install dependencies
- Run build
- Deploy to production

## Post-Deployment Checklist

### ✅ Test Core Features:

1. **Chat Interface** (`/chat`):
   - Send a message
   - Toggle research mode
   - Verify AI responses

2. **File Upload** (`/datasets`):
   - Upload a CSV file
   - Check Supabase storage
   - Verify file appears in table

3. **Data Analysis**:
   - Upload CSV
   - Ask question about data
   - Verify charts render

4. **File Deletion**:
   - Delete a file
   - Confirm removal from Supabase

### 🔧 Common Issues & Fixes

#### Build Fails
- Check all environment variables are set
- Verify TypeScript has no errors: `npm run build` locally
- Check build logs in Vercel dashboard

#### API Routes Fail (500 errors)
- Verify all API keys are correct
- Check Function logs in Vercel dashboard
- Ensure E2B API key has sufficient credits

#### Supabase Connection Issues
- Verify URL format: `https://xxxxx.supabase.co`
- Check anon key is the "anon/public" key
- Confirm service role key is set (for server-side operations)

#### Research Mode Not Working
- Verify EXA_API_KEY is set
- Check E2B sandbox can make external requests
- View function logs for specific error messages

## Supabase Setup

Make sure your Supabase database has the `files` table:

```sql
-- Run this in Supabase SQL Editor if not already created
create table files (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null,
  folder_id text not null,
  file_path text not null,
  size bigint not null,
  uploaded_at timestamp with time zone default now()
);

-- Enable Row Level Security (recommended)
alter table files enable row level security;

-- Allow all operations for now (customize based on your auth)
create policy "Allow all operations" on files for all using (true);
```

## Monitoring

### Vercel Dashboard
- **Deployments**: Track build status
- **Functions**: Monitor API route performance
- **Analytics**: View traffic and usage
- **Logs**: Debug runtime errors

### Performance Tips
1. Enable Vercel Analytics for insights
2. Monitor E2B usage (has free tier limits)
3. Check Groq API rate limits
4. Optimize large CSV uploads (consider chunking)

## Domain Setup (Optional)

1. Go to Vercel Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Vercel auto-provisions SSL certificate

## Environment-Specific Configs

### Development
- Uses `.env.local` (gitignored)
- Hot reload enabled

### Preview (PR Deployments)
- Uses Vercel environment variables
- Automatic deployment on PR creation

### Production
- Uses production environment variables
- Deployed from main branch

## Rollback

If deployment has issues:
1. Go to Vercel dashboard → Deployments
2. Find previous working deployment
3. Click "..." → Promote to Production

## Support

- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- E2B Docs: https://e2b.dev/docs
- Supabase Docs: https://supabase.com/docs

## Security Notes

⚠️ **Never commit these to Git**:
- `.env` or `.env.local` files
- API keys
- Service role keys

✅ **Always use**:
- Environment variables in Vercel
- `.env.example` for documentation
- `.gitignore` to exclude `.env*`
