// styledComponents.js

import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'

export const StyledUploadButton = styled(Button)(({ theme }) => ({
  width: 150,
  height: 150,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 24,
  borderRadius: '10%',
  border: '2px dashed',
  borderColor: theme.palette.primary.main,
  transition: 'all 0.3s',
  '&:hover': {
    backgroundColor: theme.palette.primary.light,
    borderColor: theme.palette.primary.dark,
    border: '2px solid'
  },
  '& .ri-upload-2-line': {
    fontSize: 40,
    color: theme.palette.primary.main,
    marginBottom: theme.spacing(1)
  },
  minWidth: 'unset',
  minHeight: 'unset',
  '& .MuiButton-label': {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  '& .MuiTypography-root': {
    color: theme.palette.primary.main,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1
  }
}))

export const StyledCloseButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  right: 8,
  top: 8,
  color: theme.palette.grey[900]
}))
