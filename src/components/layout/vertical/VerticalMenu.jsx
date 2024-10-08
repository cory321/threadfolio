'use client'

// MUI Imports
import { usePathname } from 'next/navigation'

import { useTheme } from '@mui/material/styles'

// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

// Component Imports
import { Menu, MenuItem } from '@menu/vertical-menu'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'
import { useSettings } from '@core/hooks/useSettings'

// Styled Component Imports
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
import menuItemStyles from '@core/styles/vertical/menuItemStyles'
import menuSectionStyles from '@core/styles/vertical/menuSectionStyles'

const RenderExpandIcon = ({ open, transitionDuration }) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='ri-arrow-right-s-line' />
  </StyledVerticalNavExpandIcon>
)

const VerticalMenu = ({ scrollMenu }) => {
  // Hooks
  const theme = useTheme()
  const verticalNavOptions = useVerticalNav()
  const { isBreakpointReached } = useVerticalNav()
  const { settings } = useSettings()
  const pathname = usePathname()

  // Vars
  const { transitionDuration } = verticalNavOptions
  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  return (
    // eslint-disable-next-line lines-around-comment
    /* Custom scrollbar instead of browser scroll, remove if you want browser scroll only */
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
            className: 'bs-full overflow-y-auto overflow-x-hidden',
            onScroll: container => scrollMenu(container, false)
          }
        : {
            options: { wheelPropagation: false, suppressScrollX: true },
            onScrollY: container => scrollMenu(container, true)
          })}
    >
      {/* Incase you also want to scroll NavHeader to scroll with Vertical Menu, remove NavHeader from above and paste it below this comment */}
      {/* Vertical Menu */}
      <Menu
        popoutMenuOffset={{ mainAxis: 10 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme, settings)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='ri-circle-line' /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        <MenuItem
          href='/dashboard'
          icon={<i className='ri-home-smile-line' />}
          active={pathname.startsWith('/dashboard')}
        >
          Home
        </MenuItem>
        <MenuItem href='/clients' icon={<i className='ri-group-line' />} active={pathname.startsWith('/clients')}>
          Clients
        </MenuItem>
        <MenuItem
          href='/orders'
          icon={<i className='ri-shopping-bag-3-line' />}
          active={pathname.startsWith('/orders')}
        >
          Orders
        </MenuItem>
        <MenuItem
          href='/appointments'
          icon={<i className='ri-calendar-2-line' />}
          active={pathname.startsWith('/appointments')}
        >
          Appointments
        </MenuItem>
        <MenuItem
          href='/services'
          icon={<i className='ri-pencil-ruler-line' />}
          active={pathname.startsWith('/services')}
        >
          Services
        </MenuItem>
        <MenuItem href='/finance' icon={<i className='ri-bar-chart-2-line' />} active={pathname.startsWith('/finance')}>
          Finance
        </MenuItem>
        <MenuItem
          href='/reports'
          icon={<i className='ri-shopping-bag-3-line' />}
          active={pathname.startsWith('/reports')}
        >
          Reports
        </MenuItem>
        <MenuItem
          href='/settings'
          icon={<i className='ri-settings-5-line' />}
          active={pathname.startsWith('/settings')}
        >
          Settings
        </MenuItem>
      </Menu>
    </ScrollWrapper>
  )
}

export default VerticalMenu
