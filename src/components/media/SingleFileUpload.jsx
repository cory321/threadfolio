import React, { useContext, useState, useEffect } from 'react'

import { Grid, Dialog, DialogContent, DialogTitle, Typography, Button, IconButton } from '@mui/material'
import { CldImage } from 'next-cloudinary'
import CloseIcon from '@mui/icons-material/Close'
import EditIcon from '@mui/icons-material/Edit'

import HoverOverlay from '@components/garments/HoverOverlay'
import { StyledUploadButton, StyledCloseButton } from './styles/SingleFileUploadWithGalleryStyles'
import UploadDropzone from '@/components/media/UploadDropzone'
import { GarmentServiceOrderContext } from '@/app/contexts/GarmentServiceOrderContext'

const UploadButton = ({ handleClickOpen, btnText }) => (
  <Grid container direction='column' justifyContent='center' alignItems='center' style={{ height: '100%' }}>
    <StyledUploadButton variant='outlined' color='primary' onClick={handleClickOpen}>
      <i className='ri-camera-line' />
      <Typography variant='body2'>{btnText}</Typography>
    </StyledUploadButton>
  </Grid>
)

const ImageDisplay = ({ publicId, handleLightboxOpen, handleClickOpen }) => (
  <Grid container direction='column' alignItems='center' spacing={0} sx={{ pt: 8 }}>
    <Grid item style={{ position: 'relative', cursor: 'pointer', borderRadius: '10px', overflow: 'hidden' }}>
      <CldImage
        src={publicId}
        alt='Photo of uploaded garment'
        width={200}
        height={200}
        crop='fill'
        quality='auto'
        fetchformat='auto'
        style={{ borderRadius: '10px', transition: '0.3s' }}
      />
      <HoverOverlay onClick={handleLightboxOpen} />
    </Grid>
    <Grid item>
      <Button variant='text' startIcon={<EditIcon />} onClick={handleClickOpen}>
        Change
      </Button>
    </Grid>
  </Grid>
)

const SingleFileUpload = ({ userId, clientId, btnText = 'Upload Garment Photo', initialImage }) => {
  const { garmentDetails, setGarmentDetails } = useContext(GarmentServiceOrderContext)
  const [open, setOpen] = useState(false)
  const [publicId, setPublicId] = useState(initialImage || garmentDetails.image_cloud_id)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  useEffect(() => {
    setPublicId(initialImage || garmentDetails.image_cloud_id)
  }, [initialImage, garmentDetails.image_cloud_id])

  const handleClickOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const handleLightboxOpen = () => setLightboxOpen(true)
  const handleLightboxClose = () => setLightboxOpen(false)

  const handleUploadSuccess = (publicId, metadata) => {
    setPublicId(publicId)
    setOpen(false)
    setGarmentDetails(prev => ({
      ...prev,
      image_cloud_id: publicId,
      image_metadata: metadata
    }))
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
        <DialogTitle>
          Garment Preview
          <IconButton
            aria-label='close'
            onClick={handleLightboxClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: theme => theme.palette.grey[500]
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {publicId && (
            <CldImage
              src={publicId}
              alt='Photo of uploaded garment'
              width={garmentDetails.image_metadata?.width || 600}
              height={garmentDetails.image_metadata?.height || 600}
              crop='fit'
              quality='auto'
              fetchformat='auto'
              style={{ width: '100%', height: 'auto', maxWidth: '600px', maxHeight: '600px' }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

export default SingleFileUpload
