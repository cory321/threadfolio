'use client'

// MUI Imports
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import Divider from '@mui/material/Divider'
import Checkbox from '@mui/material/Checkbox'
import Typography from '@mui/material/Typography'
import FormControlLabel from '@mui/material/FormControlLabel'

// Third-party imports
import classnames from 'classnames'

// Styled Component Imports
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'

const SidebarLeft = props => {
  // Props
  const {
    mdAbove,
    leftSidebarOpen,
    calendars,
    calendarsColor,
    calendarApi,
    handleSelectEvent,
    handleAllCalendars,
    handleCalendarsUpdate,
    handleLeftSidebarToggle,
    handleAddEventModalToggle // Updated
  } = props

  // Vars
  const colorsArr = calendarsColor ? Object.entries(calendarsColor) : []

  const renderFilters = colorsArr.length
    ? colorsArr.map(([key, value]) => {
        return (
          <FormControlLabel
            className='mbe-1'
            key={key}
            label={key}
            control={
              <Checkbox
                color={value}
                checked={calendars.selectedCalendars.indexOf(key) > -1}
                onChange={() => handleCalendarsUpdate(key)}
              />
            }
          />
        )
      })
    : null

  const handleSidebarToggleModal = () => {
    handleAddEventModalToggle()
  }

  if (renderFilters) {
    return (
      <Drawer
        open={leftSidebarOpen}
        onClose={handleLeftSidebarToggle}
        variant={mdAbove ? 'permanent' : 'temporary'}
        ModalProps={{
          disablePortal: true,
          disableAutoFocus: true,
          disableScrollLock: true,
          keepMounted: true // Better open performance on mobile.
        }}
        className={classnames('block', { static: mdAbove, absolute: !mdAbove })}
        PaperProps={{
          className: classnames('items-start is-[280px] shadow-none', {
            static: mdAbove,
            absolute: !mdAbove
          })
        }}
        sx={{
          zIndex: 3,
          '& .MuiDrawer-paper': {
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
            zIndex: mdAbove ? 2 : 'drawer'
          },
          '& .MuiBackdrop-root': {
            borderRadius: 1,
            position: 'absolute'
          }
        }}
      >
        <div className='is-full p-5'>
          <Button fullWidth variant='contained' onClick={handleSidebarToggleModal}>
            Add Appointment
          </Button>
        </div>
        <Divider className='is-full' />
        <AppReactDatepicker
          inline
          onChange={date => calendarApi.gotoDate(date)}
          boxProps={{
            className: 'flex justify-center is-full',
            sx: { '& .react-datepicker': { boxShadow: 'none !important', border: 'none !important' } }
          }}
        />
        <Divider className='is-full' />

        <div className='flex flex-col p-5 is-full'>
          <Typography variant='h5' className='mbe-4'>
            Event Filters
          </Typography>
          <FormControlLabel
            className='mbe-1'
            label='View All'
            control={
              <Checkbox
                color='secondary'
                checked={calendars.selectedCalendars.length === colorsArr.length}
                onChange={e => handleAllCalendars(e.target.checked)}
              />
            }
          />
          {renderFilters}
        </div>
      </Drawer>
    )
  } else {
    return null
  }
}

export default SidebarLeft
