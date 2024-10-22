import React from 'react'

import { TextField, Select, MenuItem, InputLabel, FormControl, Typography, Box, Grid } from '@mui/material'

import { STATES_USA, PROVINCES_CANADA, UK_COUNTIES } from '@/utils/addressUtils'

export default function AddressForm({ formData, handleChange }) {
  const getStateLabel = () => {
    switch (formData.country) {
      case 'US':
        return 'State'
      case 'CA':
        return 'Province/Territory'
      case 'GB':
        return 'County (optional)'
      default:
        return 'State/Province/Region'
    }
  }

  const getZipLabel = () => {
    switch (formData.country) {
      case 'US':
        return 'ZIP Code'
      case 'CA':
        return 'Postal Code'
      case 'GB':
        return 'Postcode'
      default:
        return 'ZIP/Postal Code'
    }
  }

  const getStateOptions = () => {
    switch (formData.country) {
      case 'US':
        return STATES_USA
      case 'CA':
        return PROVINCES_CANADA
      case 'GB':
        return UK_COUNTIES
      default:
        return []
    }
  }

  const getZipPlaceholder = () => {
    switch (formData.country) {
      case 'US':
        return 'e.g., 12345 or 12345-6789'
      case 'CA':
        return 'e.g., A1A 1A1'
      case 'GB':
        return 'e.g., SW1A 1AA'
      default:
        return 'Enter postal code'
    }
  }

  return (
    <Box>
      <Typography variant='h6' sx={{ mb: 6 }}>
        What is your primary business address?
      </Typography>
      <Grid container spacing={3}>
        {/* Country Selection */}
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth size='small'>
            <InputLabel id='country-label'>Country</InputLabel>
            <Select
              labelId='country-label'
              id='country'
              value={formData.country}
              label='Country'
              onChange={e => handleChange('country', e.target.value)}
            >
              <MenuItem value='none'>Select Country</MenuItem>
              <MenuItem value='US'>United States</MenuItem>
              <MenuItem value='CA'>Canada</MenuItem>
              <MenuItem value='GB'>United Kingdom</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Address Line 1 */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            size='small'
            id='addressLine1'
            label='Address Line 1'
            value={formData.addressLine1}
            onChange={e => handleChange('addressLine1', e.target.value)}
          />
        </Grid>

        {/* Address Line 2 */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            size='small'
            id='addressLine2'
            label='Address Line 2'
            value={formData.addressLine2}
            onChange={e => handleChange('addressLine2', e.target.value)}
          />
        </Grid>

        {/* City */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            size='small'
            id='city'
            label='City'
            value={formData.city}
            onChange={e => handleChange('city', e.target.value)}
          />
        </Grid>

        {/* State/Province/County Selection */}
        {formData.country !== 'none' && (
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size='small'>
              <InputLabel id='state-label'>{getStateLabel()}</InputLabel>
              <Select
                labelId='state-label'
                id='state'
                value={formData.state}
                label={getStateLabel()}
                onChange={e => handleChange('state', e.target.value)}
              >
                <MenuItem value='none'>{`Select ${getStateLabel()}`}</MenuItem>
                {getStateOptions().map(option => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}

        {/* ZIP/Postal Code */}
        {formData.country !== 'none' && (
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size='small'
              id='postalCode'
              label={getZipLabel()}
              value={formData.postalCode}
              onChange={e => handleChange('postalCode', e.target.value)}
              placeholder={getZipPlaceholder()}
              helperText={getZipPlaceholder()}
            />
          </Grid>
        )}
      </Grid>
    </Box>
  )
}
