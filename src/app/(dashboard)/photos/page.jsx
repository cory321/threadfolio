import { v2 as cloudinary } from 'cloudinary'
import { currentUser } from '@clerk/nextjs/server'

import MediaGallery from '@/components/media/MediaGallery'
import UploadButton from '@/components/media/UploadButton'

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

  // Get resources by tag and filter by folder prefix
  const { resources } = await cloudinary.api.resources_by_tag('my-cool-tag', {
    type: 'upload',
    prefix: `${user.id}/`, // Use user.id as prefix
    max_results: 50
  })

  return (
    <>
      <h2>Upload Photos</h2>
      <UploadButton userId={user.id} />
      <h2>Photo Gallery</h2>
      <MediaGallery resources={resources} />
    </>
  )
}
