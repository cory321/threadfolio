'use client'

import React, { useState } from 'react'

import { TextField, Button, Typography, Box } from '@mui/material'
import { useAuth } from '@clerk/nextjs'

import { addClientAction } from '@actions/clients'

const AddContactForm = () => {
  const { userId, getToken } = useAuth()

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    mailingAddress: '',
    notes: ''
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = e => {
    const { id, value } = e.target

    setFormData(prevFormData => ({
      ...prevFormData,
      [id]: value
    }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    const token = await getToken({ template: 'supabase' })

    try {
      const newClient = await addClientAction({
        userId,
        ...formData,
        token
      })

      console.log('Client added successfully:', newClient)

      // Clear the form
      setFormData({
        fullName: '',
        email: '',
        phoneNumber: '',
        mailingAddress: '',
        notes: ''
      })
    } catch (err) {
      console.error('Error adding client:', err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box
      component='form'
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        width: '100%',
        maxWidth: 500,
        mx: 'auto',
        mt: 4,
        p: 2,
        border: '1px solid #ccc',
        borderRadius: 1
      }}
      noValidate
      autoComplete='off'
      onSubmit={handleSubmit}
    >
      <Typography variant='h5' component='div' sx={{ mb: 2 }}>
        Add Contact
      </Typography>
      {error && <Typography color='error'>{error}</Typography>}
      <TextField
        required
        id='fullName'
        label='Full name'
        placeholder='Add full name'
        inputProps={{ maxLength: 100 }}
        fullWidth
        value={formData.fullName}
        onChange={handleChange}
      />
      <TextField
        required
        id='email'
        label='Email address'
        placeholder='Add email address'
        fullWidth
        value={formData.email}
        onChange={handleChange}
      />
      <TextField
        id='phoneNumber'
        label='Phone number'
        placeholder='Add phone number'
        fullWidth
        value={formData.phoneNumber}
        onChange={handleChange}
      />
      <Typography variant='h6' component='div' sx={{ mt: 2 }}>
        More details
      </Typography>
      <TextField
        id='mailingAddress'
        label='Mailing address'
        placeholder='Add mailing address'
        fullWidth
        value={formData.mailingAddress}
        onChange={handleChange}
      />
      <TextField
        id='notes'
        label='Private comments (only visible to you)'
        placeholder='Add some noteworthy info.'
        inputProps={{ maxLength: 1000 }}
        multiline
        rows={4}
        fullWidth
        value={formData.notes}
        onChange={handleChange}
      />
      <Button variant='contained' color='primary' sx={{ mt: 2 }} type='submit' disabled={isLoading}>
        {isLoading ? 'Adding...' : 'Add Contact'}
      </Button>
    </Box>
  )
}

export default AddContactForm
