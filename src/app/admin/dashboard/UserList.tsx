'use client'

import React from 'react'

import { Card, CardContent, CardActions, Typography, Button, Box, TextField } from '@mui/material'
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'

import { setRole, setPaymentStatus } from './_actions'

export default function UserList({ users }) {
  const handleSetPaymentStatus = async (e, userId, status) => {
    e.preventDefault()
    const formData = new FormData(e.target)

    const paymentDetails = {
      trialStartDate: formData.get('trialStartDate'),
      trialEndDate: formData.get('trialEndDate'),
      lastPaymentDate: formData.get('lastPaymentDate'),
      nextBillingDate: formData.get('nextBillingDate'),
      cancellationDate: formData.get('cancellationDate'),
      problemDescription: formData.get('problemDescription')
    }

    await setPaymentStatus(userId, status, paymentDetails)
  }

  const handleSetRole = async e => {
    e.preventDefault()
    const formData = new FormData(e.target)

    await setRole(formData)
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center', mt: 4 }}>
        {users.length > 0 ? (
          users.map(user => (
            <Card key={user.id} sx={{ minWidth: 275, maxWidth: 400 }}>
              <CardContent>
                <Typography variant='h5' component='div'>
                  {user.firstName} {user.lastName}
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  {user.emailAddresses.find(email => email.id === user.primaryEmailAddressId)?.emailAddress}
                </Typography>
                <Typography variant='body2' sx={{ mt: 1 }}>
                  Role: {user.publicMetadata.role as string}
                </Typography>
                <Typography variant='body2' sx={{ mt: 1 }}>
                  Payment Status: {user.publicMetadata.paymentStatus?.state}
                </Typography>
                {user.publicMetadata.paymentStatus?.details && (
                  <Box component='form' onSubmit={e => handleSetPaymentStatus(e, user.id, 'paying')} sx={{ mt: 2 }}>
                    <Box sx={{ mt: 1 }}>
                      <DateTimePicker
                        label='Trial Start Date'
                        name='trialStartDate'
                        defaultValue={new Date(user.publicMetadata.paymentStatus.details.trialStartDate)}
                        slots={{ textField: TextField }}
                      />
                    </Box>
                    <Box sx={{ mt: 1 }}>
                      <DateTimePicker
                        label='Trial End Date'
                        name='trialEndDate'
                        defaultValue={new Date(user.publicMetadata.paymentStatus.details.trialEndDate)}
                        slots={{ textField: TextField }}
                      />
                    </Box>
                    <Box sx={{ mt: 1 }}>
                      <DateTimePicker
                        label='Last Payment Date'
                        name='lastPaymentDate'
                        defaultValue={new Date(user.publicMetadata.paymentStatus.details.lastPaymentDate)}
                        slots={{ textField: TextField }}
                      />
                    </Box>
                    <Box sx={{ mt: 1 }}>
                      <DateTimePicker
                        label='Next Billing Date'
                        name='nextBillingDate'
                        defaultValue={new Date(user.publicMetadata.paymentStatus.details.nextBillingDate)}
                        slots={{ textField: TextField }}
                      />
                    </Box>
                    <Box sx={{ mt: 1 }}>
                      <DateTimePicker
                        label='Cancellation Date'
                        name='cancellationDate'
                        defaultValue={new Date(user.publicMetadata.paymentStatus.details.cancellationDate)}
                        slots={{ textField: TextField }}
                      />
                    </Box>
                    <TextField
                      label='Problem Description'
                      name='problemDescription'
                      defaultValue={user.publicMetadata.paymentStatus.details.problemDescription}
                      fullWidth
                      margin='normal'
                    />
                    <Button type='submit' size='small' variant='contained' color='success' sx={{ mt: 2 }}>
                      Set as Paying
                    </Button>
                  </Box>
                )}
              </CardContent>
              <CardActions>
                <form onSubmit={handleSetRole} style={{ display: 'inline' }}>
                  <input type='hidden' value={user.id} name='id' />
                  <input type='hidden' value='admin' name='role' />
                  <Button type='submit' size='small' variant='contained' color='primary'>
                    Make Admin
                  </Button>
                </form>
                <form onSubmit={handleSetRole} style={{ display: 'inline', marginLeft: '8px' }}>
                  <input type='hidden' value={user.id} name='id' />
                  <input type='hidden' value='moderator' name='role' />
                  <Button type='submit' size='small' variant='contained' color='secondary'>
                    Make Moderator
                  </Button>
                </form>
                <form
                  onSubmit={e => handleSetPaymentStatus(e, user.id, 'payment_problem')}
                  style={{ display: 'inline', marginLeft: '8px' }}
                >
                  <Button type='submit' size='small' variant='contained' color='error'>
                    Set Payment Problem
                  </Button>
                </form>
              </CardActions>
            </Card>
          ))
        ) : (
          <Typography variant='h6'>No users found.</Typography>
        )}
      </Box>
    </LocalizationProvider>
  )
}
