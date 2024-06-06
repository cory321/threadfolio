import { v2 as cloudinary } from 'cloudinary'
import { currentUser } from '@clerk/nextjs/server'

import MediaGallery from '@/components/media/MediaGallery'
import UploadDropzone from '@/components/media/UploadDropzone'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

export default async function PhotoGallery() {
  const user = await currentUser()

  if (!user) {
    // In practice, this should never happen if Clerk is correctly configured
    return <p>Redirecting to login...</p>
  }

  const clientId = 'client123' // For testing purposes
  const folderPath = `${user.id}/${clientId}/`

  // Get resources by folder prefix
  const { resources } = await cloudinary.api.resources({
    type: 'upload',
    prefix: folderPath,
    max_results: 50
  })

  return (
    <>
      <h2>Upload Photos</h2>
      <UploadDropzone userId={user.id} clientId={clientId} />
      <h2>Photo Gallery</h2>
      <MediaGallery resources={resources} />
    </>
  )
}