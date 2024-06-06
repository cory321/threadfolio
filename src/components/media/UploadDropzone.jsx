'use client'

import React, { useState } from 'react'

import { useDropzone } from 'react-dropzone'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'

import AppReactDropzone from '@/libs/styles/AppReactDropzone'

// Styled component for the upload image inside the dropzone area
const Img = styled('img')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    marginRight: theme.spacing(15.75)
  },
  [theme.breakpoints.down('md')]: {
    marginBottom: theme.spacing(4)
  },
  [theme.breakpoints.down('sm')]: {
    width: 160
  }
}))

// Styled component for the heading inside the dropzone area
const HeadingTypography = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(5),
  [theme.breakpoints.down('sm')]: {
    marginBottom: theme.spacing(4)
  }
}))

const UploadDropzone = ({ userId }) => {
  const [files, setFiles] = useState([])

  const onDrop = async acceptedFiles => {
    if (!userId) {
      console.error('Error: A user ID must be provided.')

      return
    }

    try {
      const signatureResponse = await fetch('/api/sign-cloudinary-params', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          folder: `${userId}/client123`, // Assuming client123 for testing
          tags: 'my-cool-tag'
        })
      })

      if (!signatureResponse.ok) {
        throw new Error('Failed to get signature from the server.')
      }

      const { signature, timestamp, api_key } = await signatureResponse.json()

      const formData = new FormData()

      formData.append('file', acceptedFiles[0])
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET)
      formData.append('folder', `${userId}/client123`)
      formData.append('tags', 'my-cool-tag')
      formData.append('signature', signature)
      formData.append('timestamp', timestamp)
      formData.append('api_key', api_key)

      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
          headers: {
            'X-Requested-With': 'XMLHttpRequest'
          }
        }
      )

      if (!uploadResponse.ok) {
        throw new Error('Upload failed.')
      }

      const data = await uploadResponse.json()

      console.log('Upload successful:', data)
      setFiles(acceptedFiles.map(file => Object.assign(file)))
    } catch (error) {
      console.error('Upload failed:', error)
    }
  }

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.gif'] },
    onDrop
  })

  const img = files.map(file => (
    <img key={file.name} alt={file.name} className='single-file-image' src={URL.createObjectURL(file)} />
  ))

  return (
    <AppReactDropzone {...getRootProps({ className: 'dropzone' })} {...(files.length && { sx: { height: 450 } })}>
      <input {...getInputProps()} />
      {files.length ? (
        img
      ) : (
        <div className='flex items-center flex-col md:flex-row'>
          <Img alt='Upload img' src='/images/misc/file-upload.png' className='max-bs-[160px] max-is-full bs-full' />
          <div className='flex flex-col md:[text-align:unset] text-center'>
            <HeadingTypography variant='h5'>Drop files here or click to upload.</HeadingTypography>
            <Typography>
              Drop files here or click{' '}
              <a href='/' onClick={e => e.preventDefault()} className='text-textPrimary no-underline'>
                browse
              </a>{' '}
              through your machine
            </Typography>
          </div>
        </div>
      )}
    </AppReactDropzone>
  )
}

export default UploadDropzone
