'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import dynamic from 'next/dynamic'

import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabPanel from '@mui/lab/TabPanel'
import Grid from '@mui/material/Grid'

// Component Imports
import CustomTabList from '@core/components/mui/TabList'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

const ClientAppointments = dynamic(() => import('./appointments'), {
  loading: () => <LoadingSpinner />
})

const UserRight = ({ tabContentList, clientId }) => {
  // States
  const [activeTab, setActiveTab] = useState('orders')

  const handleChange = (event, value) => {
    setActiveTab(value)
  }

  return (
    <>
      <TabContext value={activeTab}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <CustomTabList onChange={handleChange} variant='scrollable' pill='true'>
              <Tab icon={<i className='ri-shopping-bag-line' />} value='orders' label='Orders' iconPosition='start' />
              <Tab
                icon={<i className='ri-bookmark-line' />}
                value='appointments'
                label='Appointments'
                iconPosition='start'
              />
              <Tab
                icon={<i className='ri-notification-2-line' />}
                value='invoices'
                label='Invoices'
                iconPosition='start'
              />
              <Tab icon={<i className='ri-link-m' />} value='overview' label='Overview' iconPosition='start' />
            </CustomTabList>
          </Grid>
          <Grid item xs={12}>
            <TabPanel value={activeTab} className='p-0'>
              {activeTab === 'appointments' ? <ClientAppointments clientId={clientId} /> : tabContentList[activeTab]}
            </TabPanel>
          </Grid>
        </Grid>
      </TabContext>
    </>
  )
}

export default UserRight
