'use client'

import { useState } from 'react'

import CloseIcon from '@mui/icons-material/Close'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Typography from '@mui/material/Typography'

import { StyledUploadButton, StyledCloseButton } from './styles/SingleFileUploadWithGalleryStyles'
import UploadDropzone from '@/components/media/UploadDropzone'

const SingleFileUpload = ({ userId, clientId, btnText = 'Upload Garment Photo' }) => {
  const [open, setOpen] = useState(false)
  const [imageUrl, setImageUrl] = useState(null)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleUploadSuccess = url => {
    setImageUrl(url)
    setOpen(false)
  }

  return (
    <>
      {imageUrl ? (
        <img src={imageUrl} alt='Uploaded Garment' className='uploaded-garment-image' />
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
    </>
  )
}

export default SingleFileUpload
