import React from 'react'

import Image from 'next/image'

import logo from '../../../public/images/threadfolio-logo.png'

const Logo = props => {
  return (
    <div {...props}>
      <Image
        src={logo}
        alt='Threadfolio dress logo'
        width={35} // Set the desired width
        height={35} // Set the desired height, maintaining aspect ratio
        style={{ height: 'auto' }} // Maintain aspect ratio
      />
    </div>
  )
}

export default Logo
