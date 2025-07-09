import { createClient } from '@supabase/supabase-js'

// Ensure these are set in your .env file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Create a single supabase client for interacting with your app
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Utility function to upload file to Supabase storage
export async function uploadFile(file: File, userId: string) {
  try {
    // Generate a unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}-${Date.now()}.${fileExt}`
    const filePath = `${userId}/${fileName}`

    // Upload file to Supabase storage
    const { data, error } = await supabase.storage
      .from('user-files')
      .upload(filePath, file)

    console.log("data", data);

    if (error) throw error

    // Get public URL for the uploaded file
    const { data: urlData } = supabase.storage
      .from('user-files')
      .getPublicUrl(filePath)

    return {
      path: filePath,
      publicUrl: urlData?.publicUrl,
      originalName: file.name,
      size: file.size,
      type: file.type
    }
  } catch (error) {
    console.error('Error uploading file:', error)
    throw error
  }
}

// Utility function to upload file to Supabase storage
export async function uploadFileWithoutUser(file: File) {
  try {
    // Generate a unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`
    const filePath = `${fileName}`

    // Upload file to Supabase storage
    const { data, error } = await supabase.storage
      .from('audio')
      .upload(filePath, file)

    if (error) throw error

    // Get public URL for the uploaded file
    const { data: urlData } = supabase.storage
      .from('audio')
      .getPublicUrl(filePath)

    console.log("urlData", urlData);
    console.log("Data", data);

    return {
      path: filePath,
      publicUrl: urlData?.publicUrl,
      originalName: file.name,
      size: file.size,
      type: file.type
    }
  } catch (error) {
    console.error('Error uploading file:', error)
    throw error
  }
}

// Utility function to delete file from Supabase storage
export async function deleteFile(filePath: string) {
  try {
    const { error } = await supabase.storage
      .from('audio')
      .remove([filePath])

    if (error) throw error

    return true
  } catch (error) {
    console.error('Error deleting file:', error)
    throw error
  }
}

// Utility function to list files for a user
export async function listUserFiles(userId: string) {
  try {
    const { data, error } = await supabase.storage
      .from('audio')
      .list(userId, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' }
      })

    if (error) throw error

    return data
  } catch (error) {
    console.error('Error listing files:', error)
    throw error
  }
}

// Utility function to list files for a user
export async function listUserFilesWithoutUser() {
  try {
    const { data, error } = await supabase.storage
      .from('audio')
      .list('', {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' }
      })

    if (error) throw error

    return data
  } catch (error) {
    console.error('Error listing files:', error)
    throw error
  }
}

// Utility function to get public URL for a file
export function getFilePublicUrl(filePath: string) {
  const { data } = supabase.storage
    .from('audio')
    .getPublicUrl(filePath)

  return data?.publicUrl
} 