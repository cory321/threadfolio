'use client'

import { useState } from 'react'

import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import LinearProgress from '@mui/material/LinearProgress'
import { useDropzone } from 'react-dropzone'

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
  const [progress, setProgress] = useState(0)

  const onDrop = async acceptedFiles => {
    if (!userId) {
      console.error('Error: A user ID must be provided.')

      return
    }

    setFiles(acceptedFiles.map(file => Object.assign(file)))

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

      const xhr = new XMLHttpRequest()

      xhr.open(
        'POST',
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        true
      )

      xhr.upload.onprogress = event => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100

          setProgress(percentComplete)
        }
      }

      xhr.onload = () => {
        if (xhr.status === 200) {
          console.log('Upload successful:', JSON.parse(xhr.responseText))
          setProgress(100) // Ensure progress bar reaches 100% on success
        } else {
          console.error('Upload failed.')
        }
      }

      xhr.send(formData)
    } catch (error) {
      console.error('Upload failed:', error)
    }
  }

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: 'image/*', maxFiles: 1 })

  return (
    <AppReactDropzone {...getRootProps({ className: 'dropzone' })}>
      <input {...getInputProps()} />
      {files.length ? (
        <img
          key={files[0].name}
          alt={files[0].name}
          src={URL.createObjectURL(files[0])}
          className='single-file-image'
        />
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
      {progress > 0 && (
        <Box sx={{ width: '100%', mt: 2 }}>
          <LinearProgress variant='determinate' value={progress} />
        </Box>
      )}
    </AppReactDropzone>
  )
}

export default UploadDropzone
