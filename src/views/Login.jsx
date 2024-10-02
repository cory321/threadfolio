'use client'

import { SignIn } from '@clerk/nextjs'

import Illustrations from '@components/Illustrations'

import { useImageVariant } from '@core/hooks/useImageVariant'

const LoginV1 = ({ mode }) => {
  // Vars
  const darkImg = '/images/pages/auth-v1-mask-dark.png'
  const lightImg = '/images/pages/auth-v1-mask-light.png'

  const authBackground = useImageVariant(mode, lightImg, darkImg)

  return (
    <div className='flex flex-col justify-center items-center min-bs-[100dvh] relative p-6'>
      <SignIn path='/login' />
      <Illustrations maskImg={{ src: authBackground }} />
    </div>
  )
}

export default LoginV1
