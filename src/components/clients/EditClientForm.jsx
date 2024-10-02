import React, { useState } from 'react'

import { useFormik } from 'formik'
import * as Yup from 'yup'
import { TextField, Button, Typography, Box } from '@mui/material'
import { useAuth } from '@clerk/nextjs'
import { toast } from 'react-toastify'

import { updateClient } from '@actions/clients'

const EditClientForm = ({ client, onUpdate, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validationSchema = Yup.object({
    fullName: Yup.string().max(100, 'Full name must be less than 100 characters').required('Full name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    phoneNumber: Yup.string(),
    mailingAddress: Yup.string(),
    notes: Yup.string().max(1000, 'Notes must be less than 1000 characters')
  })

  const formik = useFormik({
    initialValues: {
      fullName: client.full_name || '',
      email: client.email || '',
      phoneNumber: client.phone_number || '',
      mailingAddress: client.mailing_address || '',
      notes: client.notes || ''
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      setIsSubmitting(true)

      try {
        const updatedClient = await updateClient(client.id, {
          full_name: values.fullName,
          email: values.email,
          phone_number: values.phoneNumber,
          mailing_address: values.mailingAddress,
          notes: values.notes
        })

        onUpdate(updatedClient)
        toast.success('Client information updated successfully.')
      } catch (err) {
        console.error('Error updating client:', err)
        setFieldError('general', err.message)
        toast.error(`Error updating client: ${err.message}`)
      } finally {
        setIsSubmitting(false)
        setSubmitting(false)
      }
    }
  })

  return (
    <Box component='form' onSubmit={formik.handleSubmit} noValidate>
      {formik.errors.general && <Typography color='error'>{formik.errors.general}</Typography>}
      <TextField
        required
        id='fullName'
        name='fullName'
        label='Full Name'
        fullWidth
        value={formik.values.fullName}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.fullName && Boolean(formik.errors.fullName)}
        helperText={formik.touched.fullName && formik.errors.fullName}
        margin='normal'
      />
      <TextField
        required
        id='email'
        name='email'
        label='Email Address'
        fullWidth
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.email && Boolean(formik.errors.email)}
        helperText={formik.touched.email && formik.errors.email}
        margin='normal'
      />
      <TextField
        id='phoneNumber'
        name='phoneNumber'
        label='Phone Number'
        fullWidth
        value={formik.values.phoneNumber}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
        helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
        margin='normal'
      />
      <TextField
        id='mailingAddress'
        name='mailingAddress'
        label='Mailing Address'
        fullWidth
        value={formik.values.mailingAddress}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.mailingAddress && Boolean(formik.errors.mailingAddress)}
        helperText={formik.touched.mailingAddress && formik.errors.mailingAddress}
        margin='normal'
      />
      <TextField
        id='notes'
        name='notes'
        label='Private Notes'
        fullWidth
        multiline
        rows={4}
        value={formik.values.notes}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.notes && Boolean(formik.errors.notes)}
        helperText={formik.touched.notes && formik.errors.notes}
        margin='normal'
      />
      <Box mt={2} display='flex' justifyContent='flex-end'>
        <Button color='primary' onClick={onCancel} sx={{ mr: 2 }}>
          Cancel
        </Button>
        <Button variant='contained' color='primary' type='submit' disabled={formik.isSubmitting || isSubmitting}>
          {isSubmitting ? 'Updating...' : 'Update Client'}
        </Button>
      </Box>
    </Box>
  )
}

export default EditClientForm
