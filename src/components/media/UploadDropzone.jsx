'use client'

import React from 'react'

import { useDropzone } from 'react-dropzone'
import Button from '@mui/material/Button'
import { styled } from '@mui/system'

const CustomButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#a065ff',
  borderRadius: '8px',
  '&:hover': {
    backgroundColor: '#924ce9'
  },
  color: 'white',
  margin: theme.spacing(2, 0)
}))

const UploadDropzone = ({ userId }) => {
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
    } catch (error) {
      console.error('Upload failed:', error)
    }
  }

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: 'image/*', maxFiles: 1 })

  return (
    <div>
      <div
        {...getRootProps({ className: 'dropzone' })}
        style={{ border: '2px dashed #a065ff', padding: '20px', textAlign: 'center' }}
      >
        <input {...getInputProps()} />
        <p>Drag and drop an image here or click to select a file</p>
      </div>
      <CustomButton variant='contained' onClick={() => document.querySelector('input[type="file"]').click()}>
        Upload
      </CustomButton>
    </div>
  )
}

export default UploadDropzone
