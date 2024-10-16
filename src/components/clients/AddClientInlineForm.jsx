import React, { useState } from 'react'

import { useFormik } from 'formik'
import * as Yup from 'yup'
import { TextField, Button, Typography, Box } from '@mui/material'
import { useAuth } from '@clerk/nextjs'
import { toast } from 'react-toastify'

import { addClient } from '@actions/clients'

const AddClientInlineForm = ({ onClose, onClientSelect }) => {
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
    notes: Yup.string().max(1000, 'Notes must be less than 1000 characters')
  })

  const formik = useFormik({
    initialValues: {
      fullName: '',
      email: '',
      phoneNumber: '',
      mailingAddress: '',
      notes: ''
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setFieldError }) => {
      setIsSubmitting(true)

      try {
        const newClient = await addClient({
          userId,
          ...values
        })

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
      <Box mt={2} display='flex' justifyContent='flex-end'>
        <Button variant='contained' color='primary' type='submit' disabled={formik.isSubmitting}>
          {formik.isSubmitting ? 'Adding...' : 'Add Client'}
        </Button>
      </Box>
    </Box>
  )
}

export default AddClientInlineForm
