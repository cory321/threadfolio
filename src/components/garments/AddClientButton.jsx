import { Card, CardContent, Typography, Box, useMediaQuery } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { useTheme } from '@mui/material/styles'

import colorSchemes from '@/@core/theme/colorSchemes'

const AddClientButton = ({ onClick }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Card
      onClick={onClick}
      sx={{
        border: '2px dashed',
        borderColor: 'primary.main',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 200,
        width: isMobile ? '100%' : 200,
        cursor: 'pointer'
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center'
          }}
        >
          <AddIcon fontSize='large' sx={{ color: 'primary.main' }} />
          <Typography variant='h6' sx={{ color: 'primary.main' }}>
            Add Client
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}

export default AddClientButton
