'use client'

import { Box, Grid, ImageList, ImageListItem } from '@mui/material'
import { CldImage } from 'next-cloudinary'

const MediaGallery = ({ resources }) => {
  return (
    <Box sx={{ width: '100%', overflowY: 'auto' }}>
      <ImageList variant='masonry' cols={3} gap={8}>
        {resources.map(resource => (
          <ImageListItem key={resource.asset_id}>
            <CldImage
              src={resource.public_id}
              alt={resource.public_id}
              sizes='(min-width: 768px) 33vw, (min-width: 1024px) 25vw, (min-width:1280px) 20vw, 50vw'
              width={resource.width}
              height={resource.height}
              style={{ width: '100%', height: 'auto' }}
            />
          </ImageListItem>
        ))}
      </ImageList>
    </Box>
  )
}

export default MediaGallery
