'use client'

import React, { useState } from 'react'

import { useFormik } from 'formik'
import * as Yup from 'yup'
import {
  TextField,
  Button,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  useMediaQuery,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Grid
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useAuth } from '@clerk/nextjs'
import { toast } from 'react-toastify'
import CloseIcon from '@mui/icons-material/Close'

import { addClient } from '@actions/clients'

const AddClientModal = ({ open, onClose = () => {}, setClients = () => {}, onClientSelect = null }) => {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))
  const { userId } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validationSchema = Yup.object({
    fullName: Yup.string().max(100, 'Full name must be less than 100 characters').required('Full name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    phoneNumber: Yup.string().matches(
      /(?:([+]\d{1,4})[-.\s]?)?(?:[(](\d{1,3})[)][-.\s]?)?(\d{1,4})[-.\s]?(\d{1,4})[-.\s]?(\d{1,9})/g,
      'Phone number is not valid'
    ),
    mailingAddress: Yup.string(),
    notes: Yup.string().max(1000, 'Notes must be less than 1000 characters'),
    agreesToEmailNotifications: Yup.boolean(),
    agreesToSmsNotifications: Yup.boolean()
  })

  const formik = useFormik({
    initialValues: {
      fullName: '',
      email: '',
      phoneNumber: '',
      mailingAddress: '',
      notes: '',
      agreesToEmailNotifications: true,
      agreesToSmsNotifications: true
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setFieldError }) => {
      setIsSubmitting(true)

      try {
        const newClient = await addClient({
          userId,
          ...values
        })

        setClients(prevClients => (prevClients ? [...prevClients, newClient] : [newClient]))
        resetForm()

        if (onClientSelect) {
          onClientSelect(newClient)
        }

        onClose()
        toast.success(`${newClient.full_name} has been added!`, {
          hideProgressBar: false
        })
      } catch (err) {
        console.error('Error adding client:', err)

        if (err.message === 'A client with this email already exists.') {
          setFieldError('email', err.message)
        } else if (err.message === 'A client with this phone number already exists.') {
          setFieldError('phoneNumber', err.message)
        } else {
          setFieldError('general', err.message)
        }

        toast.error(`Error adding client: ${err.message}`, {
          hideProgressBar: false
        })
      } finally {
        setIsSubmitting(false)
        setSubmitting(false)
      }
    }
  })

  return (
    <Dialog open={open} onClose={onClose} maxWidth='xs' fullWidth fullScreen={fullScreen}>
      <DialogTitle>
        Add Client
        <IconButton
          aria-label='close'
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme => theme.palette.grey[500]
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box
          component='form'
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            width: '100%'
          }}
          noValidate
          autoComplete='off'
          onSubmit={formik.handleSubmit}
        >
          {formik.errors.general && <Typography color='error'>{formik.errors.general}</Typography>}
          <TextField
            required
            id='fullName'
            name='fullName'
            label='Full name'
            placeholder='Add full name'
            inputProps={{ maxLength: 100 }}
            fullWidth
            value={formik.values.fullName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.fullName && Boolean(formik.errors.fullName)}
            helperText={formik.touched.fullName && formik.errors.fullName}
            sx={{ mt: 1 }} // Add slight padding to the top
          />
          <TextField
            required
            id='email'
            name='email'
            label='Email address'
            placeholder='Add email address'
            fullWidth
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          <TextField
            id='phoneNumber'
            name='phoneNumber'
            label='Phone number'
            placeholder='Add phone number'
            fullWidth
            value={formik.values.phoneNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
            helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
          />
          <TextField
            id='mailingAddress'
            name='mailingAddress'
            label='Mailing address'
            placeholder='Add mailing address'
            fullWidth
            value={formik.values.mailingAddress}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.mailingAddress && Boolean(formik.errors.mailingAddress)}
            helperText={formik.touched.mailingAddress && formik.errors.mailingAddress}
          />
          <TextField
            id='notes'
            name='notes'
            label='Private comments (only visible to you)'
            placeholder='Add some noteworthy info.'
            inputProps={{ maxLength: 1000 }}
            multiline
            rows={4}
            fullWidth
            value={formik.values.notes}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.notes && Boolean(formik.errors.notes)}
            helperText={formik.touched.notes && formik.errors.notes}
          />
          {/* Updated Notification Consent Section */}
          <Box mt={2}>
            <Typography variant='body1'>Client agrees to receive notifications by*</Typography>
            <FormGroup>
              <Box display='flex' justifyContent='flex-start'>
                <FormControlLabel
                  control={
                    <Checkbox
                      id='agreesToEmailNotifications'
                      name='agreesToEmailNotifications'
                      color='primary'
                      checked={formik.values.agreesToEmailNotifications}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  }
                  label='Email'
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      id='agreesToSmsNotifications'
                      name='agreesToSmsNotifications'
                      color='primary'
                      checked={formik.values.agreesToSmsNotifications}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  }
                  label='SMS'
                />
              </Box>
            </FormGroup>
          </Box>
          {/* Disclaimer */}
          <Typography variant='caption' color='textSecondary' sx={{ fontSize: '10px' }}>
            *By checking the Email and SMS boxes I confirm that the client has agreed to receive SMS or email
            notifications regarding appointment reminders and other notifications. Message and data rates may apply. The
            client can reply STOP to opt-out from SMS at any time.
          </Typography>

          {/* Add Client Button */}
          <Box mt={2} display='flex' justifyContent='flex-end'>
            <Button variant='contained' color='primary' type='submit' disabled={formik.isSubmitting}>
              {formik.isSubmitting ? 'Adding...' : 'Add Client'}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default AddClientModal
