import React, { useState } from 'react'

import { styled } from '@mui/material/styles'
import Stack from '@mui/material/Stack'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Check from '@mui/icons-material/Check'
import PersonSearchIcon from '@mui/icons-material/PersonSearch'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'
import NotesIcon from '@mui/icons-material/Notes'
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector'
import {
  Box,
  Button,
  Typography,
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Checkbox,
  FormControlLabel
} from '@mui/material'

import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import DatePickerInput from '@views/apps/calendar/DatePickerInput'
import ServiceLookup from '@/components/services/ServiceLookup'

const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: 'calc(-50% + 16px)',
    right: 'calc(50% + 16px)'
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#784af4'
    }
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#784af4'
    }
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
    borderTopWidth: 3,
    borderRadius: 1
  }
}))

const QontoStepIconRoot = styled('div')(({ theme, ownerState }) => ({
  color: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#eaeaf0',
  display: 'flex',
  height: 22,
  alignItems: 'center',
  ...(ownerState.active && {
    color: '#784af4'
  }),
  '& .QontoStepIcon-completedIcon': {
    color: '#784af4',
    zIndex: 1,
    fontSize: 18
  },
  '& .QontoStepIcon-circle': {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: 'currentColor'
  }
}))

function QontoStepIcon(props) {
  const { active, completed, className } = props

  return (
    <QontoStepIconRoot ownerState={{ active }} className={className}>
      {completed ? <Check className='QontoStepIcon-completedIcon' /> : <div className='QontoStepIcon-circle' />}
    </QontoStepIconRoot>
  )
}

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: 'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)'
    }
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: 'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)'
    }
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
    borderRadius: 1
  }
}))

const ColorlibStepIconRoot = styled('div')(({ theme, ownerState }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
  zIndex: 1,
  color: '#fff',
  width: 50,
  height: 50,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  ...(ownerState.active && {
    backgroundImage: 'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)'
  }),
  ...(ownerState.completed && {
    backgroundImage: 'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)'
  })
}))

function ColorlibStepIcon(props) {
  const { active, completed, className } = props

  const icons = {
    1: <PersonSearchIcon />,
    2: <AddShoppingCartIcon />,
    3: <NotesIcon />
  }

  return (
    <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  )
}

const steps = ['Client Lookup', 'Add Garment and Select Services', 'Add Additional Notes and Due Dates']

export default function CustomizedSteppers() {
  const [activeStep, setActiveStep] = useState(0)

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  return (
    <Stack sx={{ width: '100%' }} spacing={4}>
      <Stepper alternativeLabel activeStep={activeStep} connector={<QontoConnector />}>
        {steps.map(label => (
          <Step key={label}>
            <StepLabel StepIconComponent={QontoStepIcon}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box>
        {activeStep === 0 && (
          <Box>
            <Typography variant='h6'>Client Lookup</Typography>
            {/* Add your client lookup component here */}
          </Box>
        )}
        {activeStep === 1 && (
          <Box>
            <Typography variant='h6'>Add Garment and Select Services</Typography>
            <TextField fullWidth label='Garment Name' margin='normal' />
            <Button variant='contained' component='label' margin='normal'>
              Upload Image
              <input type='file' hidden />
            </Button>
            <FormControl fullWidth margin='normal'>
              <InputLabel>Stage</InputLabel>
              <Select>
                <MenuItem value='not started'>Not Started</MenuItem>
                <MenuItem value='working on it'>Working on it</MenuItem>
                <MenuItem value='done'>Done</MenuItem>
                <MenuItem value='stuck'>Stuck</MenuItem>
                <MenuItem value='archived'>Archived</MenuItem>
              </Select>
            </FormControl>
            <ServiceLookup />
          </Box>
        )}
        {activeStep === 2 && (
          <Box>
            <Typography variant='h6'>Add Additional Notes and Due Dates</Typography>
            <TextField fullWidth label='Instructions and Notes' multiline rows={4} margin='normal' />
            <AppReactDatepicker
              selected={null}
              onChange={() => {}}
              customInput={<DatePickerInput label='Due Date' dateFormat='EEEE, MMMM d, yyyy' />}
            />
            <FormControlLabel control={<Checkbox />} label='For Event' />
            <AppReactDatepicker
              selected={null}
              onChange={() => {}}
              customInput={<DatePickerInput label='Event Date' dateFormat='EEEE, MMMM d, yyyy' />}
            />
          </Box>
        )}
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
        <Button color='inherit' disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
          Back
        </Button>
        <Box sx={{ flex: '1 1 auto' }} />
        <Button onClick={handleNext}>{activeStep === steps.length - 1 ? 'Finish' : 'Next'}</Button>
      </Box>
    </Stack>
  )
}
