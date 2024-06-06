'use client'

import React from 'react'

import { CldUploadButton } from 'next-cloudinary'
import Button from '@mui/material/Button'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { styled } from '@mui/system'

const CustomButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#a065ff', // your desired color
  borderRadius: '8px', // match the background for smooth corners
  '&:hover': {
    backgroundColor: '#924ce9' // hover color
  },
  color: 'white'
}))

const UploadButton = ({ userId }) => {
  if (!userId) {
    return <p>Error: A user ID must be provided.</p>
  }

  return (
    <CldUploadButton
      signatureEndpoint='/api/sign-cloudinary-params'
      options={{
        autoMinimize: true,
        folder: userId // Set the folder to the userId
      }}
    >
      <CustomButton variant='contained' startIcon={<CloudUploadIcon />}>
        Upload
      </CustomButton>
    </CldUploadButton>
  )
}

export default UploadButton
