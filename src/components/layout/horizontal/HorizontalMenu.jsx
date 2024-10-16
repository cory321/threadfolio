// Do not remove this following 'use client' else SubMenu rendered in vertical menu on smaller screen will not work.
'use client'

// MUI Imports
import { usePathname } from 'next/navigation' // Import usePathname

import { useTheme } from '@mui/material/styles'

// Component Imports
import HorizontalNav, { Menu, MenuItem } from '@menu/horizontal-menu'
import VerticalNavContent from './VerticalNavContent'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'
import { useSettings } from '@core/hooks/useSettings'

// Styled Component Imports
import StyledHorizontalNavExpandIcon from '@menu/styles/horizontal/StyledHorizontalNavExpandIcon'
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
import verticalNavigationCustomStyles from '@core/styles/vertical/navigationCustomStyles'
import menuRootStyles from '@core/styles/horizontal/menuRootStyles'
import menuItemStyles from '@core/styles/horizontal/menuItemStyles'
import verticalMenuItemStyles from '@core/styles/vertical/menuItemStyles'
import verticalMenuSectionStyles from '@core/styles/vertical/menuSectionStyles'

const RenderExpandIcon = ({ level }) => (
  <StyledHorizontalNavExpandIcon level={level}>
    <i className='ri-arrow-right-s-line' />
  </StyledHorizontalNavExpandIcon>
)

const RenderVerticalExpandIcon = ({ open, transitionDuration }) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='ri-arrow-right-s-line' />
  </StyledVerticalNavExpandIcon>
)

const HorizontalMenu = () => {
  // Hooks
  const verticalNavOptions = useVerticalNav()
  const theme = useTheme()
  const { settings } = useSettings()
  const pathname = usePathname()

  // Vars
  const { skin } = settings
  const { transitionDuration } = verticalNavOptions

  return (
    <HorizontalNav
      switchToVertical
      verticalNavContent={VerticalNavContent}
      verticalNavProps={{
        customStyles: verticalNavigationCustomStyles(verticalNavOptions, theme),
        backgroundColor:
          skin === 'bordered' ? 'var(--mui-palette-background-paper)' : 'var(--mui-palette-background-default)',
        transitionDuration: 0
      }}
    >
      <Menu
        rootStyles={menuRootStyles(theme)}
        renderExpandIcon={({ level }) => <RenderExpandIcon level={level} />}
        renderExpandedMenuItemIcon={{ icon: <i className='ri-circle-line' /> }}
        menuItemStyles={menuItemStyles(settings, theme)}
        popoutMenuOffset={{
          mainAxis: ({ level }) => (level && level > 0 ? 4 : 16),
          alignmentAxis: 0
        }}
        verticalMenuProps={{
          menuItemStyles: verticalMenuItemStyles(verticalNavOptions, theme, settings),
          renderExpandIcon: ({ open }) => (
            <RenderVerticalExpandIcon open={open} transitionDuration={transitionDuration} />
          ),
          renderExpandedMenuItemIcon: { icon: <i className='ri-circle-line' /> },
          menuSectionStyles: verticalMenuSectionStyles(verticalNavOptions, theme)
        }}
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
        <MenuItem href='/garments' icon={<i className='ri-t-shirt-line' />} active={pathname.startsWith('/garments')}>
          Garments
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
        <MenuItem
          href='/finance'
          icon={<i className='ri-money-dollar-circle-line' />}
          active={pathname.startsWith('/finance')}
        >
          Invoices
        </MenuItem>
        <MenuItem
          href='/settings'
          icon={<i className='ri-settings-5-line' />}
          active={pathname.startsWith('/settings')}
        >
          Settings
        </MenuItem>
      </Menu>
    </HorizontalNav>
  )
}

export default HorizontalMenu
