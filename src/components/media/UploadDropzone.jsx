'use client'

import { useState } from 'react'

import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import LinearProgress from '@mui/material/LinearProgress'
import Button from '@mui/material/Button'
import { useDropzone } from 'react-dropzone'

// Styled Components
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

const HeadingTypography = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(5),
  [theme.breakpoints.down('sm')]: {
    marginBottom: theme.spacing(4)
  }
}))

const AppReactDropzone = styled(Box)(({ theme }) => ({
  '&.dropzone, & .dropzone': {
    minHeight: 300,
    display: 'flex',
    flexWrap: 'wrap',
    cursor: 'pointer',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(4),
    borderRadius: theme.shape.borderRadius,
    border: `2px dashed ${theme.palette.mode === 'light' ? 'rgba(93, 89, 98, 0.22)' : 'rgba(247, 244, 254, 0.14)'}`,
    [theme.breakpoints.down('xs')]: {
      textAlign: 'center'
    },
    '&:focus': {
      outline: 'none'
    },
    '& .single-file-image': {
      width: '300px', // Make the image width smaller
      height: 'auto'
    }
  }
}))

const UploadContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(2),
  '& .buttons': {
    marginTop: theme.spacing(2),
    display: 'flex',
    gap: theme.spacing(1)
  }
}))

const UploadDropzone = ({ userId }) => {
  const [file, setFile] = useState(null)
  const [progress, setProgress] = useState(0)

  const onDrop = acceptedFiles => {
    setFile(acceptedFiles[0])
  }

  const handleUpload = async () => {
    if (!userId || !file) {
      console.error('Error: A user ID and a file must be provided.')

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

      formData.append('file', file)
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

  const handleRemoveFile = () => {
    setFile(null)
  }

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: 'image/*', maxFiles: 1 })

  return (
    <UploadContainer>
      <AppReactDropzone {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        {file ? (
          <>
            <img key={file.name} alt={file.name} src={URL.createObjectURL(file)} className='single-file-image' />
          </>
        ) : (
          <div className='flex items-center flex-col md:flex-row'>
            <Img alt='Upload img' src='/images/misc/file-upload.png' className='max-bs-[160px] max-is-full bs-full' />
            <div className='flex flex-col md:[text-align:unset] text-center'>
              <HeadingTypography variant='h5'>Drop file here or click to upload.</HeadingTypography>
              <Typography>Allowed *.jpeg, *.jpg, *.png, *.gif</Typography>
              <Typography>Max size of 2 MB</Typography>
            </div>
          </div>
        )}
        {progress > 0 && (
          <Box sx={{ width: '100%', mt: 2 }}>
            <LinearProgress variant='determinate' value={progress} />
          </Box>
        )}
      </AppReactDropzone>
      {file && (
        <div className='buttons'>
          <Button color='error' variant='outlined' onClick={handleRemoveFile}>
            Remove
          </Button>
          <Button variant='contained' onClick={handleUpload}>
            Upload
          </Button>
        </div>
      )}
    </UploadContainer>
  )
}

export default UploadDropzone
