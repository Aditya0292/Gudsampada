import { createClient } from './client'

/**
 * Compress image using HTML Canvas client-side
 */
export async function compressImage(file: File, maxWidth = 1000, quality = 0.85): Promise<Blob> {
  if (!file.type.startsWith('image/')) {
    return file
  }

  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(img.src)
      let width = img.width
      let height = img.height

      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width)
        width = maxWidth
      }

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        resolve(file)
        return
      }

      ctx.drawImage(img, 0, 0, width, height)
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob)
          } else {
            resolve(file)
          }
        },
        file.type === 'image/png' ? 'image/png' : 'image/jpeg',
        quality
      )
    }
    img.onerror = (err) => reject(err)
  })
}

/**
 * Upload product image to Supabase Storage 'product-images' bucket
 */
export async function uploadProductImage(file: File): Promise<string> {
  const compressedBlob = await compressImage(file)

  const fileExt = file.name.split('.').pop() || 'jpg'
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`
  const filePath = `catalog/${fileName}`

  // Create a new File from the Blob to append to FormData
  const compressedFile = new File([compressedBlob], fileName, { type: compressedBlob.type })

  const formData = new FormData()
  formData.append('file', compressedFile)
  formData.append('filePath', filePath)

  const response = await fetch('/api/admin/upload-image', {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(`Image upload failed: ${errorData.error || response.statusText}`)
  }

  const { publicUrl } = await response.json()
  return publicUrl
}
