// React Imports
import { useState } from 'react'

// MUI Imports
import Tab from '@mui/material/Tab'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'

// Component Imports
import CustomTabList from '@core/components/mui/TabList'
import AddClientCard from '@components/garments/AddClientCard'
import AddContactForm from '@/components/clients/AddContactForm'
import ClientSearch from '@components/clients/ClientSearch'

const GarmentClientLookup = ({ userId }) => {
  const [value, setValue] = useState('1')

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <Grid container spacing={5}>
      <Grid item xs={2}>
        <AddClientCard />
      </Grid>
      <Grid item xs={10}>
        <TabContext value={value}>
          <CustomTabList pill='true' onChange={handleChange} aria-label='customized tabs example'>
            <Tab value='1' label='Find Client' />
            <Tab value='2' label='Add New Client' />
          </CustomTabList>
          <TabPanel value='1'>
            <h2>Find Existing Client</h2>
            <ClientSearch userId={userId} />
          </TabPanel>
          <TabPanel value='2'>
            <h2>Add a new client</h2>
            <AddContactForm />
          </TabPanel>
        </TabContext>
      </Grid>
    </Grid>
  )
}

export default GarmentClientLookup
