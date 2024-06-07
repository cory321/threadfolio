'use client'

import { useState, useRef } from 'react'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import LinearProgress from '@mui/material/LinearProgress'
import Button from '@mui/material/Button'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'

import { UploadContainer } from '@/libs/styles/AppReactDropzone'

const CameraUpload = ({ userId, clientId = 'general' }) => {
  const [file, setFile] = useState(null)
  const [progress, setProgress] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [uploadError, setUploadError] = useState(false)
  const [cameraActive, setCameraActive] = useState(false)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  const handleUpload = async () => {
    if (!userId || !file) {
      console.error('Error: A user ID and a file must be provided.')

      return
    }

    setUploading(true)
    setUploadError(false)

    try {
      const signatureResponse = await fetch('/api/sign-cloudinary-params', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          folder: `${userId}/${clientId}`
        })
      })

      if (!signatureResponse.ok) {
        throw new Error('Failed to get signature from the server.')
      }

      const { signature, timestamp, api_key } = await signatureResponse.json()

      const formData = new FormData()

      formData.append('file', file)
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET)
      formData.append('folder', `${userId}/${clientId}`)
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
          setUploadSuccess(true)
          setProgress(0)
        } else {
          console.error('Upload failed.')
          setUploadError(true)
        }
      }

      xhr.onerror = () => {
        setUploading(false)
        setUploadError(true)
        console.error('Network error or upload failed.')
      }

      xhr.send(formData)
    } catch (error) {
      setUploading(false)
      setUploadError(true)
      console.error('Upload failed:', error)
    }
  }

  const handleRemoveFile = () => {
    setFile(null)
    setUploadSuccess(false)
    setUploadError(false)
    setProgress(0)
  }

  const handleUploadAnother = () => {
    setFile(null)
    setUploadSuccess(false)
    setUploadError(false)
    setProgress(0)
  }

  const startCamera = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(stream => {
        videoRef.current.srcObject = stream
        videoRef.current.play()
        setCameraActive(true)
      })
      .catch(err => console.error('Error accessing camera: ', err))
  }

  const capturePhoto = () => {
    const context = canvasRef.current.getContext('2d')

    context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height)
    canvasRef.current.toBlob(blob => {
      setFile(blob)
      setCameraActive(false)
      const tracks = videoRef.current.srcObject.getTracks()

      tracks.forEach(track => track.stop())
    }, 'image/jpeg')
  }

  return (
    <UploadContainer>
      {cameraActive ? (
        <div>
          <video ref={videoRef} width='320' height='240' autoPlay style={{ display: 'block' }}></video>
          <Button variant='contained' onClick={capturePhoto} sx={{ mt: 2 }}>
            Capture Photo
          </Button>
        </div>
      ) : (
        <Button variant='contained' onClick={startCamera}>
          Start Camera
        </Button>
      )}
      <canvas ref={canvasRef} width='320' height='240' style={{ display: 'none' }}></canvas>
      {file && (
        <div>
          <img alt='Captured' src={URL.createObjectURL(file)} style={{ maxWidth: '100%', marginTop: '20px' }} />
          {!uploading && !uploadSuccess && !uploadError && (
            <div className='buttons' style={{ marginTop: '20px' }}>
              <Button variant='contained' onClick={handleUpload}>
                Upload
              </Button>
              <Button color='error' variant='outlined' onClick={handleRemoveFile}>
                Remove
              </Button>
            </div>
          )}
        </div>
      )}
      {progress > 0 && (
        <Box sx={{ width: '100%', mt: 2 }}>
          <LinearProgress variant='determinate' value={progress} />
        </Box>
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

export default CameraUpload
