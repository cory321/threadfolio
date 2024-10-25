'use client'

// React Imports
import { useState } from 'react'

// Next Imports
import Link from 'next/link'

// MUI Imports
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import useMediaQuery from '@mui/material/useMediaQuery'
import useScrollTrigger from '@mui/material/useScrollTrigger'
import Box from '@mui/material/Box'

// Third-party Imports
import classnames from 'classnames'

// Component Imports
import { UserButton, useUser } from '@clerk/nextjs'

import Logo from '@components/layout/shared/Logo'
import ModeDropdown from '@components/layout/shared/ModeDropdown'
import FrontMenu from './FrontMenu'

// Util Imports
import { frontLayoutClasses } from '@/@layouts/utils/layoutClasses'

// Styles Imports
import styles from './styles.module.css'

const Header = ({ mode }) => {
  // States
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // Hooks
  const { user } = useUser()
  const isBelowLgScreen = useMediaQuery(theme => theme.breakpoints.down('lg'))

  // Detect window scroll
  const trigger = useScrollTrigger({
    threshold: 0,
    disableHysteresis: true
  })

  return (
    <header className={classnames(frontLayoutClasses.header, styles.header)}>
      <div className={classnames(frontLayoutClasses.navbar, styles.navbar, { [styles.headerScrolled]: trigger })}>
        <div className={classnames(frontLayoutClasses.navbarContent, styles.navbarContent)}>
          {isBelowLgScreen ? (
            // For small screens
            <div className='flex items-center gap-2 sm:gap-4'>
              <IconButton onClick={() => setIsDrawerOpen(true)} className='-mis-2'>
                <i className='ri-menu-line text-textPrimary' />
              </IconButton>
              <Link href='/'>
                <Logo />
              </Link>
              <FrontMenu mode={mode} isDrawerOpen={isDrawerOpen} setIsDrawerOpen={setIsDrawerOpen} />
              {user ? (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <UserButton />
                  <Button variant='contained' color='primary' size='large' sx={{ mt: 4 }} href='/dashboard'>
                    Go to Dashboard
                  </Button>
                </Box>
              ) : (
                <>
                  <Button color='inherit' href='/login'>
                    Login
                  </Button>
                  <Button variant='contained' color='primary' sx={{ ml: 2 }} href='/register'>
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          ) : (
            // For large screens
            <div className='flex items-center gap-10'>
              <Link href='/'>
                <Logo />
              </Link>
              <FrontMenu mode={mode} isDrawerOpen={isDrawerOpen} setIsDrawerOpen={setIsDrawerOpen} />
              <div className='flex-grow' />
              {user ? (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <UserButton />
                  <Button variant='contained' color='primary' size='large' sx={{ mt: 4 }} href='/dashboard'>
                    Go to Dashboard
                  </Button>
                </Box>
              ) : (
                <>
                  <Button color='inherit' href='/login'>
                    Login
                  </Button>
                  <Button variant='contained' color='primary' sx={{ ml: 2 }} href='/register'>
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
