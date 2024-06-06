'use client'

import { useEffect, useRef } from 'react'

const CameraFeed = () => {
  const videoRef = useRef(null)

  useEffect(() => {
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })

        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      } catch (err) {
        console.error('Error accessing the camera', err)
      }
    }

    startVideo()

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks()

        tracks.forEach(track => track.stop())
      }
    }
  }, [])

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline />
    </div>
  )
}

export default CameraFeed
