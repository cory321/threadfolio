import { Typography, Box, useMediaQuery } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { useTheme } from '@mui/material/styles'

import { StyledAddClientCard, StyledCardContent } from '@components/media/styles/SingleFileUploadWithGalleryStyles'

const AddClientButton = ({ onClick }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <StyledAddClientCard onClick={onClick} {...(isMobile ? { ismobile: 'true' } : {})}>
      <StyledCardContent>
        <Box>
          <AddIcon fontSize='large' sx={{ color: 'primary.main' }} />
          <Typography variant='h6' sx={{ color: 'primary.main' }}>
            Add Client
          </Typography>
        </Box>
      </StyledCardContent>
    </StyledAddClientCard>
  )
}

export default AddClientButton
