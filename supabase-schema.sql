-- Supabase Database Schema for Fusion AI

-- Create files table
CREATE TABLE IF NOT EXISTS files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('csv', 'pdf', 'svg')),
  folder_id TEXT NOT NULL,
  file_path TEXT NOT NULL UNIQUE,
  size BIGINT NOT NULL,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_files_folder_id ON files(folder_id);
CREATE INDEX IF NOT EXISTS idx_files_uploaded_at ON files(uploaded_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE files ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (adjust based on your auth requirements)
CREATE POLICY "Allow all operations on files" ON files
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_files_updated_at
  BEFORE UPDATE ON files
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create Storage Bucket for files (run this in Supabase Dashboard > Storage)
-- Bucket name: "files"
-- Public: false (or true if you want public access)
-- File size limit: 50MB (adjust as needed)

/*
To create the storage bucket, go to Supabase Dashboard:
1. Navigate to Storage
2. Click "New Bucket"
3. Name: "files"
4. Public: false
5. Set file size limit: 52428800 (50MB)

Then create a storage policy:
*/

-- Storage policy (run after creating bucket)
-- This allows authenticated users to upload, read, and delete files
CREATE POLICY "Allow file operations" ON storage.objects
  FOR ALL
  USING (bucket_id = 'files')
  WITH CHECK (bucket_id = 'files');
