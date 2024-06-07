import React from 'react'

import { styled, alpha } from '@mui/material/styles'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import VisibilityIcon from '@mui/icons-material/Visibility'

const StyledHoverOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '200px',
  height: '200px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: alpha(theme.palette.primary.main, 0.5), // Primary main color with 50% transparency
  opacity: 0,
  borderRadius: '10px', // Match the rounded corners of the image
  transition: 'opacity 0.3s',
  '&:hover': {
    opacity: 1
  }
}))

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  color: 'white',
  backgroundColor: 'transparent'
}))

const HoverOverlay = ({ onClick }) => (
  <StyledHoverOverlay onClick={onClick}>
    <StyledIconButton aria-label='view'>
      <VisibilityIcon fontSize='large' />
    </StyledIconButton>
  </StyledHoverOverlay>
)

export default HoverOverlay
