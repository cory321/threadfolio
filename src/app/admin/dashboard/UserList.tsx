'use client'

import React from 'react'

import { Card, CardContent, CardActions, Typography, Button, Box } from '@mui/material'

import { setRole } from './_actions'

export default function UserList({ users }) {
  return (
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
            </CardContent>
            <CardActions>
              <form action={setRole} style={{ display: 'inline' }}>
                <input type='hidden' value={user.id} name='id' />
                <input type='hidden' value='admin' name='role' />
                <Button type='submit' size='small' variant='contained' color='primary'>
                  Make Admin
                </Button>
              </form>
              <form action={setRole} style={{ display: 'inline', marginLeft: '8px' }}>
                <input type='hidden' value={user.id} name='id' />
                <input type='hidden' value='moderator' name='role' />
                <Button type='submit' size='small' variant='contained' color='secondary'>
                  Make Moderator
                </Button>
              </form>
            </CardActions>
          </Card>
        ))
      ) : (
        <Typography variant='h6'>No users found.</Typography>
      )}
    </Box>
  )
}
