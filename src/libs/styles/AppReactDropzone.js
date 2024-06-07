import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

// Styled Components
export const Img = styled('img')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    marginRight: theme.spacing(15.75)
  },
  [theme.breakpoints.down('md')]: {
    marginBottom: theme.spacing(4)
  },
  [theme.breakpoints.down('sm')]: {
    width: 160
  }
}))

export const HeadingTypography = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(5),
  [theme.breakpoints.down('sm')]: {
    marginBottom: theme.spacing(4)
  }
}))

export const AppReactDropzone = styled(Box)(({ theme }) => ({
  '&.dropzone, & .dropzone': {
    width: '100%',
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
    },
    '& .single-file-image': {
      width: '300px', // Make the image width smaller
      height: 'auto'
    }
  }
}))

export const UploadContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(2),
  '& .buttons': {
    marginTop: theme.spacing(2),
    display: 'flex',
    gap: theme.spacing(1)
  },
  '& .success-message, & .error-message': {
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(2)
  },
  '& .success-message': {
    color: theme.palette.success.main
  },
  '& .error-message': {
    color: theme.palette.error.main
  }
}))
