// src/app/api/delete-file/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function DELETE(req: NextRequest) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { searchParams } = new URL(req.url);
    const fileId = searchParams.get('fileId');

    if (!fileId) {
      return NextResponse.json({ error: 'No file ID provided' }, { status: 400 });
    }

    // First, get the file metadata to retrieve the file path
    const { data: fileData, error: fetchError } = await supabaseAdmin
      .from('files')
      .select('file_path')
      .eq('id', fileId)
      .single();

    if (fetchError) {
      console.error('Error fetching file metadata:', fetchError);
      return NextResponse.json(
        { error: `Failed to fetch file: ${fetchError.message}` },
        { status: 500 }
      );
    }

    if (!fileData) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Delete file from Supabase Storage
    const { error: storageError } = await supabaseAdmin.storage
      .from('e2b')
      .remove([fileData.file_path]);

    if (storageError) {
      console.error('Storage deletion error:', storageError);
      // Continue with database deletion even if storage deletion fails
    }

    // Delete file metadata from database
    const { error: dbError } = await supabaseAdmin
      .from('files')
      .delete()
      .eq('id', fileId);

    if (dbError) {
      console.error('Database deletion error:', dbError);
      return NextResponse.json(
        { error: `Database error: ${dbError.message}` },
        { status: 500 }
      );
    }

    console.log(`✅ File deleted: ${fileData.file_path}`);

    return NextResponse.json({
      success: true,
      message: 'File deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete API error:', error);
    return NextResponse.json(
      { error: error.message || 'Delete failed' },
      { status: 500 }
    );
  }
}
