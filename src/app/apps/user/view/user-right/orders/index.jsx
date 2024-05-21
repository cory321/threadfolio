'use client'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

const OrdersTab = () => {
  return (
    <Card>
      <CardHeader title='Order History' />
      <Divider />
      <CardContent>
        <Typography className='font-medium' color='text.primary'>
          All current and past orders will show here
        </Typography>
      </CardContent>
      <Divider />
      <div className='overflow-x-auto'>
        <table className={tableStyles.table}></table>
      </div>
      <CardActions className='flex items-center gap-2'>
        <Button variant='contained' type='submit'>
          Save Changes
        </Button>
        <Button variant='outlined' color='secondary' type='reset'>
          Discard
        </Button>
      </CardActions>
    </Card>
  )
}

export default OrdersTab
