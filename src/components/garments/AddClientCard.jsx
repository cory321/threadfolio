import { Card, CardContent, Typography, Box } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'

const AddClientCard = () => {
  return (
    <Card
      sx={{
        border: '2px dashed grey',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 200,
        width: 200,
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: '#f0f0f0'
        }
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
          <AddIcon fontSize='large' />
          <Typography variant='h6'>Add Client</Typography>
        </Box>
      </CardContent>
    </Card>
  )
}

export default AddClientCard
