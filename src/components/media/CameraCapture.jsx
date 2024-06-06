import React, { useRef, useState, useEffect } from 'react'

import Button from '@mui/material/Button'
import Box from '@mui/material/Box'

const CameraCapture = ({ onCapture }) => {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [isCameraOn, setIsCameraOn] = useState(false)
  const [stream, setStream] = useState(null)

  useEffect(() => {
    return () => {
      if (stream) {
        stopVideoStream()
      }
    }
  }, [stream])

  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })

      setStream(stream)

      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }

      setIsCameraOn(true)
    } catch (err) {
      console.error('Error accessing the camera', err)
    }
  }

  const stopVideoStream = () => {
    if (stream) {
      const tracks = stream.getTracks()

      tracks.forEach(track => track.stop())
      setStream(null)
    }

    setIsCameraOn(false)
  }

  const takePicture = () => {
    const width = videoRef.current.videoWidth
    const height = videoRef.current.videoHeight

    canvasRef.current.width = width
    canvasRef.current.height = height

    const context = canvasRef.current.getContext('2d')

    context.drawImage(videoRef.current, 0, 0, width, height)

    const dataUrl = canvasRef.current.toDataURL('image/png')

    onCapture(dataUrl)
  }

  const buttonStyle = {
    margin: '10px',
    padding: '15px 30px',
    fontSize: '16px'
  }

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline style={{ display: isCameraOn ? 'block' : 'none' }} />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <Box mt={2}>
        {!isCameraOn ? (
          <Button variant='contained' color='primary' style={buttonStyle} onClick={startVideo}>
            Start Camera
          </Button>
        ) : (
          <>
            <Button variant='contained' color='secondary' style={buttonStyle} onClick={takePicture}>
              Take Picture
            </Button>
            <Button variant='contained' color='error' style={buttonStyle} onClick={stopVideoStream}>
              Stop Camera
            </Button>
          </>
        )}
      </Box>
    </div>
  )
}

export default CameraCapture
