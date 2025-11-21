# Supabase Setup Instructions

## 1. Database Setup

1. Go to your Supabase project: https://imznhahhoxojlpxxizox.supabase.co
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `supabase-schema.sql`
4. Click **Run** to execute the SQL

This creates:
- ✅ `files` table with proper schema
- ✅ Indexes for performance
- ✅ Row Level Security policies
- ✅ Auto-updating `updated_at` trigger

## 2. Storage Bucket Setup

1. Navigate to **Storage** in Supabase Dashboard
2. Click **New Bucket**
3. Configure:
   - **Name**: `files`
   - **Public**: ❌ Off (keep private)
   - **File size limit**: 52428800 bytes (50MB)
   - **Allowed MIME types**: `text/csv` (optional)

4. After creating the bucket, go to **Policies** tab
5. Click **New Policy** → **For full customization**
6. Add this policy:

```sql
CREATE POLICY "Allow file operations" ON storage.objects
  FOR ALL
  USING (bucket_id = 'files')
  WITH CHECK (bucket_id = 'files');
```

## 3. Verify Environment Variables

Check your `.env` file has:
```
NEXT_PUBLIC_SUPABASE_URL=https://imznhahhoxojlpxxizox.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 4. Test Upload

1. Start dev server: `npm run dev`
2. Navigate to `/datasets`
3. Click **Upload New File**
4. Select a CSV file
5. Choose a folder
6. Click **Upload**

## Features

✅ **CSV Upload**: Only CSV files allowed  
✅ **Folder Organization**: Assign files to colored folders  
✅ **File Metadata**: Name, size, upload timestamp  
✅ **Folder Management**: Rename folders with dropdown menu  
✅ **Folder Selector**: Change file folders with colored tags  
✅ **Auto Counts**: Folder item counts update automatically  

## Database Schema

```
files
├── id (UUID, primary key)
├── name (TEXT)
├── type (TEXT) - 'csv', 'pdf', 'svg'
├── folder_id (TEXT)
├── file_path (TEXT) - Supabase storage path
├── size (BIGINT) - bytes
├── uploaded_at (TIMESTAMPTZ)
├── created_at (TIMESTAMPTZ)
└── updated_at (TIMESTAMPTZ)
```

## Storage Structure

```
files/
└── datasets/
    ├── personal-finance/
    │   └── 1732320000_budget.csv
    ├── fitness-tracker/
    │   └── 1732320100_workouts.csv
    └── travel-records/
        └── 1732320200_trips.csv
```
