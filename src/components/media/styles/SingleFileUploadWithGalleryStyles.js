import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'

export const StyledUploadButton = styled(Button)(({ theme }) => ({
  width: 150,
  height: 150,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 24,
  borderRadius: '10px',
  border: '2px dashed',
  borderColor: theme.palette.primary.main,
  transition: 'all 0.3s',
  '&:hover': {
    backgroundColor: theme.palette.primary.light,
    borderColor: theme.palette.primary.dark,
    border: '2px solid'
  },
  '& .ri-camera-line': {
    fontSize: 40,
    color: theme.palette.primary.main,
    marginBottom: theme.spacing(1)
  },
  '& .ri-t-shirt-line': {
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

export const StyledAddGarmentButton = styled(Button)(({ theme, fullWidth }) => ({
  width: fullWidth ? '100%' : 200,
  height: 200,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 24,
  borderRadius: '10px',
  border: '2px dashed',
  borderColor: theme.palette.primary.main,
  transition: 'all 0.3s',
  '&:hover': {
    backgroundColor: theme.palette.primary.light,
    borderColor: theme.palette.primary.dark,
    border: '2px solid'
  },
  '& .ri-camera-line': {
    fontSize: 40,
    color: theme.palette.primary.main,
    marginBottom: theme.spacing(1)
  },
  '& .ri-t-shirt-line': {
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

export const StyledAddClientCard = styled(Button)(({ theme, ismobile }) => ({
  width: ismobile ? '100%' : 200,
  height: 200,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 24,
  borderRadius: '10px',
  border: '2px dashed',
  borderColor: theme.palette.primary.main,
  transition: 'all 0.3s',
  '&:hover': {
    backgroundColor: theme.palette.primary.light,
    borderColor: theme.palette.primary.dark,
    border: '2px solid'
  },
  cursor: 'pointer',
  minWidth: 'unset',
  minHeight: 'unset',
  '& .MuiCardContent-root': {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center'
  },
  '& .MuiTypography-root': {
    color: theme.palette.primary.main,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1
  }
}))

export const StyledCardContent = styled(CardContent)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center'
})
