'use client'

import { useState } from 'react'

import CloseIcon from '@mui/icons-material/Close'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Typography from '@mui/material/Typography'
import { CldImage } from 'next-cloudinary'

import { StyledUploadButton, StyledCloseButton } from './styles/SingleFileUploadWithGalleryStyles'
import UploadDropzone from '@/components/media/UploadDropzone'

const SingleFileUpload = ({ userId, clientId, btnText = 'Upload Garment Photo' }) => {
  const [open, setOpen] = useState(false)
  const [publicId, setPublicId] = useState(null)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [imageMetadata, setImageMetadata] = useState({ width: 0, height: 0 })

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleLightboxOpen = () => {
    setLightboxOpen(true)
  }

  const handleLightboxClose = () => {
    setLightboxOpen(false)
  }

  const handleUploadSuccess = (publicId, metadata) => {
    setPublicId(publicId)
    setImageMetadata(metadata)
    setOpen(false)
  }

  return (
    <>
      {publicId ? (
        <div onClick={handleLightboxOpen} style={{ cursor: 'pointer' }}>
          <CldImage
            src={publicId}
            alt='Photo of uploaded garment'
            width={200}
            height={200}
            crop='fill'
            quality='auto'
            fetchFormat='auto'
            style={{ width: '200px', height: '200px' }}
          />
        </div>
      ) : (
        <StyledUploadButton variant='outlined' color='primary' onClick={handleClickOpen}>
          <i className='ri-upload-2-line' />
          <Typography variant='body2'>{btnText}</Typography>
        </StyledUploadButton>
      )}
      <Dialog fullScreen open={open} onClose={handleClose}>
        <DialogTitle>
          {btnText}
          <StyledCloseButton aria-label='close' onClick={handleClose}>
            <CloseIcon />
          </StyledCloseButton>
        </DialogTitle>
        <DialogContent>
          <UploadDropzone userId={userId} clientId={clientId} onUploadSuccess={handleUploadSuccess} />
        </DialogContent>
      </Dialog>
      <Dialog open={lightboxOpen} onClose={handleLightboxClose} maxWidth='lg'>
        <DialogContent>
          {publicId && (
            <CldImage
              src={publicId}
              alt='Photo of uploaded garment'
              width={imageMetadata.width}
              height={imageMetadata.height}
              crop='fit'
              quality='auto'
              fetchFormat='auto'
              style={{ width: '100%', height: 'auto' }} // Ensure the height is set to auto to retain the aspect ratio
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

export default SingleFileUpload
