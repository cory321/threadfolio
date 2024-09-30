import { Card, CardHeader, CardContent, Typography } from '@mui/material'

const GarmentNotes = ({ notes }) => {
  return (
    <Card sx={{ mt: 2 }}>
      <CardHeader title='Garment Notes' />
      <CardContent>
        <Typography variant='body1'>{notes || 'No notes'}</Typography>
      </CardContent>
    </Card>
  )
}

export default GarmentNotes
