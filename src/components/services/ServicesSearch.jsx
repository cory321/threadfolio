'use client'

import React, { useState, useCallback, useTransition } from 'react'

import throttle from 'lodash/throttle'
import { useAuth } from '@clerk/nextjs'
import { TextField, CircularProgress, Autocomplete, Typography, Box, Button } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { styled } from '@mui/material/styles'

import { searchServices } from '@actions/services'
import InitialsAvatar from '@/components/InitialsAvatar'
import CreateServiceDialog from '@/components/garments/garment-service-table/CreateServiceDialog'

const CustomTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInputLabel-root': {
    display: 'flex',
    alignItems: 'center'
  },
  '& .MuiInputLabel-root svg': {
    marginRight: theme.spacing(1)
  }
}))

const ServicesSearch = ({ userId, onServiceSelect = () => {}, onClose = () => {} }) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [selectedService, setSelectedService] = useState(null)
  const { getToken } = useAuth()
  const [loading, setLoading] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [openCreateDialog, setOpenCreateDialog] = useState(false)

  const fetchServices = useCallback(
    async query => {
      setLoading(true)

      try {
        const token = await getToken({ template: 'supabase' })

        if (token) {
          const data = await searchServices(query, userId, token)

          setResults(data.length > 0 ? data : [])
        }
      } catch (error) {
        console.error('Error fetching services:', error)
        setResults([])
      } finally {
        setLoading(false)
      }
    },
    [getToken, userId]
  )

  const handleSearch = useCallback(throttle(fetchServices, 300), [fetchServices])

  const handleQueryChange = (event, newValue) => {
    const newQuery = (event ? event.target.value : newValue) || ''

    setQuery(newQuery)
    startTransition(() => {
      if (newQuery.length > 1) {
        handleSearch(newQuery)
      } else {
        setResults([])
      }
    })
  }

  const handleSelect = (event, value) => {
    if (value) {
      setQuery(value.name)
      setSelectedService(value) // Store the selected service
    } else {
      setQuery('')
      setSelectedService(null)
    }
  }

  const handleConfirmSelection = () => {
    if (selectedService) {
      onServiceSelect(selectedService) // Call the callback with the selected service
      onClose() // Close the modal
    }
  }

  const handleKeyPress = event => {
    if (event.key === 'Enter' && selectedService) {
      handleConfirmSelection()
    }
  }

  const handleCreateDialogOpen = () => setOpenCreateDialog(true)
  const handleCreateDialogClose = () => setOpenCreateDialog(false)

  return (
    <>
      <Autocomplete
        options={results}
        getOptionLabel={option => option.name || ''}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        onInputChange={handleQueryChange}
        onChange={handleSelect}
        inputValue={query}
        autoHighlight
        filterOptions={x => x}
        loading={loading}
        noOptionsText={'No services found'}
        onKeyPress={handleKeyPress} // Add the key press event listener
        renderInput={params => (
          <CustomTextField
            {...params}
            label={
              <>
                <SearchIcon />
                Type to search service
              </>
            }
            variant='outlined'
            fullWidth
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading && <CircularProgress color='inherit' size={20} />}
                  {params.InputProps.endAdornment}
                </>
              )
            }}
          />
        )}
        renderOption={(props, option) => (
          <li {...props} key={option.id}>
            <Box display='flex' alignItems='center'>
              <InitialsAvatar fullName={option.name} />
              <Box ml={2}>
                <Typography variant='body1' component='div' fontWeight='bold'>
                  {option.name}
                </Typography>
                <Typography variant='body2' color='textSecondary'>
                  {option.qty} {option.unit} @ ${option.unit_price}
                </Typography>
              </Box>
            </Box>
          </li>
        )}
      />
      <Box mt={2} display='flex' justifyContent='flex-end'>
        <Button
          variant='outlined'
          color='primary'
          onClick={handleCreateDialogOpen}
          sx={{ mr: 2 }} // Add right margin for spacing
        >
          Create New Service
        </Button>
        <Button variant='contained' color='primary' onClick={handleConfirmSelection} disabled={!selectedService}>
          Add Service to Garment
        </Button>
      </Box>

      <CreateServiceDialog
        open={openCreateDialog}
        onClose={handleCreateDialogClose}
        onServiceSelect={onServiceSelect}
      />
    </>
  )
}

export default ServicesSearch
