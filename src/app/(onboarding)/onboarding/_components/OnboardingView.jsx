'use client'

import Illustrations from '@components/Illustrations'

import { useImageVariant } from '@core/hooks/useImageVariant'

import OnboardingQuestions from './OnboardingQuestions'

const OnboardingView = ({ mode, userData }) => {
  const darkImg = '/images/pages/auth-v1-mask-dark.png'
  const lightImg = '/images/pages/auth-v1-mask-light.png'

  const authBackground = useImageVariant(mode, lightImg, darkImg)

  return (
    <div className='flex flex-col justify-center items-center min-h-[100dvh] relative p-6'>
      <div className='z-10 w-full max-w-[800px]'>
        <OnboardingQuestions userData={userData} />
      </div>
      <Illustrations maskImg={{ src: authBackground }} />
    </div>
  )
}

export default OnboardingView
