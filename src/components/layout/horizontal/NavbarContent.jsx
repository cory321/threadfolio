'use client'

// Third-party Imports
import classnames from 'classnames'

// Component Imports
import { UserButton } from '@clerk/nextjs'

import NavToggle from './NavToggle'
import Logo from '@components/layout/shared/Logo'
import ModeDropdown from '@components/layout/shared/ModeDropdown'

// Hook Imports
import useHorizontalNav from '@menu/hooks/useHorizontalNav'

// Util Imports
import { horizontalLayoutClasses } from '@layouts/utils/layoutClasses'

const NavbarContent = () => {
  // Hooks
  const { isBreakpointReached } = useHorizontalNav()

  return isBreakpointReached ? (
    <div
      className={classnames(horizontalLayoutClasses.navbarContent, 'flex items-center justify-between gap-4 is-full')}
    >
      <div className='flex items-center gap-4'>
        <NavToggle />
      </div>
      {isBreakpointReached && (
        <div className='flex flex-grow justify-center'>
          <Logo />
        </div>
      )}

      {/* Right Section */}
      <div className='flex items-center'>
        <ModeDropdown />
        <UserButton />
      </div>
    </div>
  ) : null
}

export default NavbarContent
