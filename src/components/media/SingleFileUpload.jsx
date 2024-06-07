'use client'

import { useState } from 'react'

import { Grid, Dialog, DialogContent, DialogTitle, Typography, Button } from '@mui/material'
import { CldImage } from 'next-cloudinary'
import CloseIcon from '@mui/icons-material/Close'
import EditIcon from '@mui/icons-material/Edit'

import HoverOverlay from '@components/garments/HoverOverlay'

import { StyledUploadButton, StyledCloseButton } from './styles/SingleFileUploadWithGalleryStyles'
import UploadDropzone from '@/components/media/UploadDropzone'

const UploadButton = ({ handleClickOpen, btnText }) => (
  <StyledUploadButton variant='outlined' color='primary' onClick={handleClickOpen}>
    <i className='ri-camera-line' />
    <Typography variant='body2'>{btnText}</Typography>
  </StyledUploadButton>
)

const ImageDisplay = ({ publicId, handleLightboxOpen, handleClickOpen }) => (
  <Grid container direction='column' alignItems='center' spacing={0}>
    <Grid item style={{ position: 'relative', cursor: 'pointer', borderRadius: '10px', overflow: 'hidden' }}>
      <CldImage
        src={publicId}
        alt='Photo of uploaded garment'
        width={200}
        height={200}
        crop='fill'
        quality='auto'
        fetchFormat='auto'
        style={{ borderRadius: '10px', transition: '0.3s' }}
      />
      <HoverOverlay onClick={handleLightboxOpen} />
    </Grid>
    <Grid item>
      <Button variant='outlined' startIcon={<EditIcon />} onClick={handleClickOpen}>
        Change
      </Button>
    </Grid>
  </Grid>
)

const SingleFileUpload = ({ userId, clientId, btnText = 'Upload Garment Photo' }) => {
  const [open, setOpen] = useState(false)
  const [publicId, setPublicId] = useState(null)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [imageMetadata, setImageMetadata] = useState({ width: 0, height: 0 })

  const handleClickOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const handleLightboxOpen = () => setLightboxOpen(true)
  const handleLightboxClose = () => setLightboxOpen(false)

  const handleUploadSuccess = (publicId, metadata) => {
    setPublicId(publicId)
    setImageMetadata(metadata)
    setOpen(false)
  }

  return (
    <>
      {publicId ? (
        <ImageDisplay publicId={publicId} handleLightboxOpen={handleLightboxOpen} handleClickOpen={handleClickOpen} />
      ) : (
        <UploadButton handleClickOpen={handleClickOpen} btnText={btnText} />
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
              style={{ width: '100%', height: 'auto' }} // Added borderRadius for rounded edges
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

export default SingleFileUpload
