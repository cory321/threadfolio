import React from 'react'

import { Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box } from '@mui/material'

const OrderSummary = ({ orderId, selectedClient, garments }) => {
  const calculateTotal = () => {
    return garments.reduce((total, garment) => {
      const garmentTotal = garment.services.reduce((sum, service) => {
        return sum + service.qty * service.unit_price
      }, 0)

      return total + garmentTotal
    }, 0)
  }

  return (
    <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
      <Typography variant='h5' gutterBottom>
        Does everything look correct?
      </Typography>
      <Typography variant='body1'>Order ID: {orderId}</Typography>
      <Typography variant='body1'>Client: {selectedClient.full_name}</Typography>
      <Typography variant='body1'>Email: {selectedClient.email}</Typography>
      <Typography variant='body1'>Phone: {selectedClient.phone_number}</Typography>

      {garments.map((garment, index) => (
        <Box key={index} sx={{ marginTop: 3 }}>
          <Typography variant='h6'>
            Garment {index + 1}: {garment.name}
          </Typography>
          <Typography variant='body2'>
            Due Date: {garment.due_date ? new Date(garment.due_date).toLocaleDateString() : 'Not set'}
          </Typography>
          {garment.is_event && garment.event_date && (
            <Typography variant='body2'>Event Date: {new Date(garment.event_date).toLocaleDateString()}</Typography>
          )}
          <Typography variant='body2'>Notes: {garment.notes || 'No notes'}</Typography>

          <TableContainer component={Paper} sx={{ marginTop: 2 }}>
            <Table size='small'>
              <TableHead>
                <TableRow>
                  <TableCell>Service</TableCell>
                  <TableCell align='right'>Quantity</TableCell>
                  <TableCell align='right'>Unit</TableCell>
                  <TableCell align='right'>Unit Price</TableCell>
                  <TableCell align='right'>Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {garment.services &&
                  garment.services.map((service, serviceIndex) => (
                    <TableRow key={serviceIndex}>
                      <TableCell component='th' scope='row'>
                        {service.name}
                      </TableCell>
                      <TableCell align='right'>{service.qty}</TableCell>
                      <TableCell align='right'>{service.unit}</TableCell>
                      <TableCell align='right'>${parseFloat(service.unit_price).toFixed(2)}</TableCell>
                      <TableCell align='right'>${(service.qty * parseFloat(service.unit_price)).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                {(!garment.services || garment.services.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={5} align='center'>
                      No services added for this garment
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      ))}

      <Typography variant='h6' sx={{ marginTop: 3 }}>
        Total Order Amount: ${calculateTotal().toFixed(2)}
      </Typography>
    </Paper>
  )
}

export default OrderSummary
