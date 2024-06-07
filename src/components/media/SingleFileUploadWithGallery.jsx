'use client'

import { useState } from 'react'

import CloseIcon from '@mui/icons-material/Close'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Tab from '@mui/material/Tab'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import Typography from '@mui/material/Typography'

import { StyledUploadButton, StyledCloseButton } from './styles/SingleFileUploadWithGalleryStyles'

import UploadDropzone from '@/components/media/UploadDropzone'
import MediaGallery from '@/components/media/MediaGallery'

const SingleFileUploadWithGallery = ({ userId, clientId, resources, btnText = 'Upload Photo' }) => {
  const [value, setValue] = useState('1')
  const [open, setOpen] = useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <>
      <StyledUploadButton variant='outlined' color='primary' onClick={handleClickOpen}>
        <i className='ri-upload-2-line' />
        <Typography variant='body2'>{btnText}</Typography>
      </StyledUploadButton>
      <Dialog fullScreen open={open} onClose={handleClose}>
        <DialogTitle>
          Manage Photos
          <StyledCloseButton aria-label='close' onClick={handleClose}>
            <CloseIcon />
          </StyledCloseButton>
        </DialogTitle>
        <DialogContent>
          <TabContext value={value}>
            <TabList centered onChange={handleChange} aria-label='Upload images and view media gallery'>
              <Tab value='1' label='Upload' />
              <Tab value='2' label='Photo Gallery' />
            </TabList>
            <TabPanel value='1'>
              <UploadDropzone userId={userId} clientId={clientId} />
            </TabPanel>
            <TabPanel value='2'>
              <MediaGallery resources={resources} />
            </TabPanel>
          </TabContext>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default SingleFileUploadWithGallery
