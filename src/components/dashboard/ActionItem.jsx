'use client'

import { memo } from 'react'

import Link from 'next/link'

import { ListItemIcon, ListItemText } from '@mui/material'
import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button'

// Styled Components
const StyledButton = styled(Button)(({ theme, isMobile }) => ({
  marginBottom: theme.spacing(2),
  padding: isMobile ? '18px' : theme.spacing(1),
  fontSize: isMobile ? '1.1rem' : '0.875rem',
  textTransform: 'none',
  color: isMobile ? theme.palette.common.white : theme.palette.text.primary,
  backgroundColor: isMobile ? theme.palette.primary.main : 'transparent',
  justifyContent: 'flex-start',
  textAlign: 'left',
  borderRadius: theme.shape.borderRadius,
  boxShadow: isMobile ? theme.shadows[2] : 'none',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: isMobile ? theme.palette.primary.dark : 'transparent',
    transform: isMobile ? 'translateY(-3px)' : 'none',
    boxShadow: isMobile ? theme.shadows[4] : 'none',
    '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
      color: isMobile ? theme.palette.common.white : theme.palette.primary.main
    }
  },
  '& .MuiListItemIcon-root': {
    minWidth: 'auto',
    marginRight: theme.spacing(2),
    color: isMobile ? theme.palette.common.white : 'inherit'
  },
  '& .MuiListItemText-primary': {
    color: isMobile ? theme.palette.common.white : 'inherit'
  }
}))

const ActionItem = memo(({ action, isMobile, handleNavigation }) => {
  const handleClick = () => handleNavigation(action.link, action.modal)

  const content = isMobile ? (
    <>
      <i className={action.icon} aria-hidden='true' style={{ marginRight: '8px' }} />
      {action.text}
    </>
  ) : (
    <>
      <ListItemIcon>
        <i className={action.icon} aria-hidden='true' />
      </ListItemIcon>
      <ListItemText primary={action.text} />
    </>
  )

  const buttonProps = {
    fullWidth: true,
    onClick: handleClick,
    ariaLabel: action.text,
    isMobile: isMobile,
    ...(isMobile && { variant: 'contained' })
  }

  if (action.modal) {
    return <StyledButton {...buttonProps}>{content}</StyledButton>
  }

  return (
    <Link href={action.link} passHref legacyBehavior>
      <StyledButton component='a' {...buttonProps}>
        {content}
      </StyledButton>
    </Link>
  )
})

export default ActionItem
