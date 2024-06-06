'use client'

import { useState } from 'react'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import LinearProgress from '@mui/material/LinearProgress'
import Button from '@mui/material/Button'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import { useDropzone } from 'react-dropzone'

import { Img, HeadingTypography, AppReactDropzone, UploadContainer } from '@/libs/styles/AppReactDropzone'

const UploadDropzone = ({ userId }) => {
  const [file, setFile] = useState(null)
  const [progress, setProgress] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [uploadError, setUploadError] = useState(false)
  const [fileSizeError, setFileSizeError] = useState(false)

  const onDrop = acceptedFiles => {
    setFile(acceptedFiles[0])
    setUploadSuccess(false) // Reset upload success status on new file drop
    setUploadError(false) // Reset upload error status on new file drop
    setFileSizeError(false) // Reset file size error status on new file drop
  }

  const handleUpload = async () => {
    if (!userId || !file) {
      console.error('Error: A user ID and a file must be provided.')

      return
    }

    setUploading(true)
    setUploadError(false)
    setFileSizeError(false)

    try {
      const signatureResponse = await fetch('/api/sign-cloudinary-params', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          folder: `${userId}/client321`, // Assuming client321 for testing
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
      formData.append('folder', `${userId}/client321`)
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
        setUploading(false)

        if (xhr.status === 200) {
          console.log('Upload successful:', JSON.parse(xhr.responseText))
          setUploadSuccess(true) // Indicate upload success
          setProgress(0) // Hide progress bar immediately
        } else {
          console.error('Upload failed.')
          setUploadError(true) // Indicate upload error
        }
      }

      xhr.onerror = () => {
        setUploading(false)
        setUploadError(true) // Indicate upload error
        console.error('Network error or upload failed.')
      }

      xhr.send(formData)
    } catch (error) {
      setUploading(false)
      setUploadError(true) // Indicate upload error
      console.error('Upload failed:', error)
    }
  }

  const handleRemoveFile = () => {
    setFile(null)
    setUploadSuccess(false) // Reset upload success status on file removal
    setUploadError(false) // Reset upload error status on file removal
    setFileSizeError(false) // Reset file size error status on file removal
    setProgress(0) // Reset progress bar
  }

  const { getRootProps, getInputProps, fileRejections } = useDropzone({
    onDrop,
    accept: 'image/*',
    maxFiles: 1,
    maxSize: 10485760 // 10 MB in bytes
  })

  const handleUploadAnother = () => {
    setFile(null)
    setUploadSuccess(false)
    setUploadError(false)
    setFileSizeError(false)
    setProgress(0)
  }

  return (
    <UploadContainer>
      <AppReactDropzone {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        {file ? (
          !uploadSuccess ? (
            <img key={file.name} alt={file.name} src={URL.createObjectURL(file)} className='single-file-image' />
          ) : (
            <div className='success-message'>
              <CheckCircleIcon />
              <Typography variant='body1' sx={{ ml: 1 }}>
                Upload successful!
              </Typography>
            </div>
          )
        ) : (
          <div className='flex items-center flex-col md:flex-row'>
            <Img alt='Upload img' src='/images/misc/file-upload.png' className='max-bs-[160px] max-is-full bs-full' />
            <div className='flex flex-col md:[text-align:unset] text-center'>
              <HeadingTypography variant='h5'>Drop file here or click to upload.</HeadingTypography>
              <Typography>Allowed *.jpeg, *.jpg, *.png, *.gif</Typography>
              <Typography>Max size of 10 MB</Typography>
            </div>
          </div>
        )}
        {progress > 0 && (
          <Box sx={{ width: '100%', mt: 2 }}>
            <LinearProgress variant='determinate' value={progress} />
          </Box>
        )}
      </AppReactDropzone>
      {fileRejections.length > 0 && (
        <div className='error-message'>
          <ErrorIcon />
          <Typography variant='body1' sx={{ ml: 1 }}>
            File is too large. Maximum size is 10 MB.
          </Typography>
        </div>
      )}
      {file && !uploading && !uploadSuccess && !uploadError && (
        <div className='buttons'>
          <Button variant='contained' onClick={handleUpload}>
            Upload
          </Button>
          <Button color='error' variant='outlined' onClick={handleRemoveFile}>
            Remove
          </Button>
        </div>
      )}
      {uploadError && (
        <div className='error-message'>
          <ErrorIcon />
          <Typography variant='body1' sx={{ ml: 1 }}>
            Upload failed. Please try again.
          </Typography>
        </div>
      )}
      {(uploadSuccess || uploadError) && (
        <Button variant='contained' onClick={handleUploadAnother} sx={{ mt: 2 }}>
          Upload Another?
        </Button>
      )}
    </UploadContainer>
  )
}

export default UploadDropzone
