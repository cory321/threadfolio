// components/BlendedImage.jsx

import Image from 'next/image'

const BlendedImage = ({ src, alt, width, height }) => {
  const containerStyle = {
    position: 'relative',
    width: `${width}px`,
    height: `${height}px`,
    overflow: 'hidden'
  }

  const imageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    mixBlendMode: 'multiply'
  }

  return (
    <div style={containerStyle}>
      <Image src={src} alt={alt} layout='fill' objectFit='cover' style={imageStyle} />
    </div>
  )
}

export default BlendedImage
