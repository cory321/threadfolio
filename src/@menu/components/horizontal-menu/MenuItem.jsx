'use client'

// React Imports
import { forwardRef, useContext, useEffect, useState } from 'react'

// Next Imports
import { usePathname } from 'next/navigation'

// Third-party Imports
import classnames from 'classnames'
import { useUpdateEffect } from 'react-use'
import { useFloatingTree } from '@floating-ui/react'

// Context Imports
import { HorizontalSubMenuContext } from './SubMenu'

// Component Imports
import MenuButton from './MenuButton'

// Hook Imports
import useHorizontalMenu from '../../hooks/useHorizontalMenu'
import useVerticalNav from '../../hooks/useVerticalNav'

// Util Imports
import { renderMenuIcon } from '../../utils/menuUtils'
import { menuClasses } from '../../utils/menuClasses'

// Styled Component Imports
import StyledMenuLabel from '../../styles/StyledMenuLabel'
import StyledMenuPrefix from '../../styles/StyledMenuPrefix'
import StyledMenuSuffix from '../../styles/StyledMenuSuffix'
import StyledHorizontalMenuItem from '../../styles/horizontal/StyledHorizontalMenuItem'

// Style Imports
import styles from '../../styles/horizontal/horizontalUl.module.css'

const MenuItem = (props, ref) => {
  // Props
  const {
    children,
    icon,
    className,
    prefix,
    suffix,
    level = 0,
    disabled = false,
    component,
    onActiveChange,
    rootStyles,
    active: activeProp,
    ...rest
  } = props

  // States
  const [internalActive, setInternalActive] = useState(false)
  const isActive = activeProp !== undefined ? activeProp : internalActive

  // Hooks
  const tree = useFloatingTree()
  const pathname = usePathname()
  const { toggleVerticalNav, isToggled } = useVerticalNav()
  const { getItemProps } = useContext(HorizontalSubMenuContext)
  const { menuItemStyles, renderExpandedMenuItemIcon, textTruncate } = useHorizontalMenu()

  const getMenuItemStyles = element => {
    // If the menuItemStyles prop is provided, get the styles for the specified element.
    if (menuItemStyles) {
      // Define the parameters that are passed to the style functions.
      const params = { level, disabled, active: isActive, isSubmenu: false }

      // Get the style function for the specified element.
      const styleFunction = menuItemStyles[element]

      if (styleFunction) {
        // If the style function is a function, call it and return the result.
        // Otherwise, return the style function itself.
        return typeof styleFunction === 'function' ? styleFunction(params) : styleFunction
      }
    }
  }

  // Handle the click event.
  const handleClick = () => {
    if (isToggled) {
      toggleVerticalNav()
    }
  }

  // Change active state when the url changes
  useEffect(() => {
    if (activeProp === undefined) {
      const href = rest.href || (component && typeof component !== 'string' && component.props.href)

      if (href) {
        // Check if the current url matches any of the children urls
        if (pathname === href) {
          setInternalActive(true)
        } else {
          setInternalActive(false)
        }
      }
    }
  }, [pathname, activeProp])

  // Call the onActiveChange callback when the active state changes.
  useUpdateEffect(() => {
    onActiveChange?.(isActive)
  }, [isActive])

  return (
    <StyledHorizontalMenuItem
      ref={ref}
      className={classnames(
        { [menuClasses.menuItemRoot]: level === 0 },
        { [menuClasses.active]: isActive },
        { [menuClasses.disabled]: disabled },
        styles.li,
        className
      )}
      level={level}
      disabled={disabled}
      buttonStyles={getMenuItemStyles('button')}
      menuItemStyles={getMenuItemStyles('root')}
      rootStyles={rootStyles}
    >
      <MenuButton
        className={classnames(menuClasses.button, { [menuClasses.active]: isActive })}
        component={component}
        tabIndex={disabled ? -1 : 0}
        onClick={handleClick}
        {...getItemProps({
          onClick(event) {
            props.onClick?.(event)
            tree?.events.emit('click')
          }
        })}
        {...rest}
      >
        {/* Menu Item Icon */}
        {renderMenuIcon({
          icon,
          level,
          active: isActive,
          disabled,
          renderExpandedMenuItemIcon,
          styles: getMenuItemStyles('icon')
        })}

        {/* Menu Item Prefix */}
        {prefix && (
          <StyledMenuPrefix
            firstLevel={level === 0}
            className={menuClasses.prefix}
            rootStyles={getMenuItemStyles('prefix')}
          >
            {prefix}
          </StyledMenuPrefix>
        )}

        {/* Menu Item Label */}
        <StyledMenuLabel
          className={menuClasses.label}
          rootStyles={getMenuItemStyles('label')}
          textTruncate={textTruncate}
        >
          {children}
        </StyledMenuLabel>

        {/* Menu Item Suffix */}
        {suffix && (
          <StyledMenuSuffix
            firstLevel={level === 0}
            className={menuClasses.suffix}
            rootStyles={getMenuItemStyles('suffix')}
          >
            {suffix}
          </StyledMenuSuffix>
        )}
      </MenuButton>
    </StyledHorizontalMenuItem>
  )
}

export default forwardRef(MenuItem)
