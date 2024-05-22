// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports
import UserDetails from './UserDetails'

// import UserPlan from './UserPlan'

const UserLeftOverview = ({ userData }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <UserDetails userData={userData} />
      </Grid>
    </Grid>
  )
}

export default UserLeftOverview
