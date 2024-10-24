// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports
import UserDetails from './UserDetails'

// import UserPlan from './UserPlan'

const UserLeftOverview = ({ userData, onClientUpdate }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <UserDetails userData={userData} onClientUpdate={onClientUpdate} />
      </Grid>
    </Grid>
  )
}

export default UserLeftOverview
