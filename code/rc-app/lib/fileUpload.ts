import { put, del } from '@vercel/blob';

/**
 * Generates a unique filename with timestamp and random string
 */
function generateUniqueFilename(originalName: string): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = originalName.split('.').pop();
  return `${timestamp}-${randomString}.${extension}`;
}

/**
 * Saves an uploaded file to Vercel Blob storage
 * @param file - The File object from the upload
 * @returns The URL of the uploaded file
 */
export async function saveUploadedFile(file: File): Promise<string> {
  const filename = generateUniqueFilename(file.name);
  
  // Upload to Vercel Blob
  const blob = await put(filename, file, {
    access: 'public',
  });
  
  // Return the public URL
  return blob.url;
}

/**
 * Deletes a file from Vercel Blob storage
 * @param fileUrl - The URL of the file to delete
 */
export async function deleteUploadedFile(fileUrl: string): Promise<void> {
  if (!fileUrl) {
    return;
  }
  
  try {
    await del(fileUrl);
  } catch (error) {
    console.error('Error deleting file from Vercel Blob:', error);
    // Don't throw - just log the error
  }
}
