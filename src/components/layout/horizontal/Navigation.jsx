'use client'

// Third-party Imports
import styled from '@emotion/styled'
import classnames from 'classnames'

// Component Imports
import { UserButton } from '@clerk/nextjs'

import ModeDropdown from '@components/layout/shared/ModeDropdown'

import HorizontalMenu from './HorizontalMenu'

// Config Imports
import themeConfig from '@configs/themeConfig'

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'
import useHorizontalNav from '@menu/hooks/useHorizontalNav'

// Util Imports
import { horizontalLayoutClasses } from '@layouts/utils/layoutClasses'

// Import statements
import Logo from '@components/layout/shared/Logo'

const StyledDiv = styled.div`
  ${({ isContentCompact, isBreakpointReached }) =>
    !isBreakpointReached &&
    `
    padding: ${themeConfig.layoutPadding}px;

    ${
      isContentCompact &&
      `
      margin-inline: auto;
      max-inline-size: ${themeConfig.compactContentWidth}px;
    `
    }
  `}
`

const Navigation = () => {
  // Hooks
  const { settings } = useSettings()
  const { isBreakpointReached } = useHorizontalNav()

  // Vars
  const headerContentCompact = settings.navbarContentWidth === 'compact'

  return (
    <div
      {...(!isBreakpointReached && {
        className: classnames(horizontalLayoutClasses.navigation, 'relative flex border-bs')
      })}
    >
      <StyledDiv
        isContentCompact={headerContentCompact}
        isBreakpointReached={isBreakpointReached}
        {...(!isBreakpointReached && {
          className: classnames(
            horizontalLayoutClasses.navigationContentWrapper,
            'flex items-center justify-between w-full plb-2.5'
          )
        })}
      >
        {/* Left Section: Logo */}
        {!isBreakpointReached && <Logo isNavLink={true} />}

        {/* Middle Section: Horizontal Menu */}
        <div className='flex-grow mx-4'>
          <HorizontalMenu />
        </div>

        {/* Right Section: User Button */}
        {!isBreakpointReached && <ModeDropdown />}
        {!isBreakpointReached && <UserButton />}
      </StyledDiv>
    </div>
  )
}

export default Navigation
