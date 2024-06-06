'use client'

import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'

// Styled Components
const AppReactDropzone = styled(Box)(({ theme }) => ({
  '&.dropzone, & .dropzone': {
    minHeight: 300,
    display: 'flex',
    flexWrap: 'wrap',
    cursor: 'pointer',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(4),
    borderRadius: theme.shape.borderRadius,
    border: `2px dashed ${theme.palette.mode === 'light' ? 'rgba(93, 89, 98, 0.22)' : 'rgba(247, 244, 254, 0.14)'}`,
    [theme.breakpoints.down('xs')]: {
      textAlign: 'center'
    },
    '&:focus': {
      outline: 'none'
    }
  }
}))

export default AppReactDropzone
