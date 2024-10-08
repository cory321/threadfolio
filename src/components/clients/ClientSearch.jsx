'use client'

import { useState, useMemo, useCallback, useTransition } from 'react'

import throttle from 'lodash/throttle'
import { TextField, CircularProgress, Autocomplete, Typography, Box } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { styled } from '@mui/material/styles'

import { searchClients } from '@actions/clients'
import InitialsAvatar from '@/components/InitialsAvatar'

const CustomTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInputLabel-root': {
    display: 'flex',
    alignItems: 'center'
  },
  '& .MuiInputLabel-root svg': {
    marginRight: theme.spacing(1)
  }
}))

const ClientSearch = ({ onClientSelect = () => {}, onClose = () => {} }) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [selectedClient, setSelectedClient] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isPending, startTransition] = useTransition()

  const fetchClients = useCallback(async query => {
    setLoading(true)

    try {
      const data = await searchClients(query)

      setResults(data.length > 0 ? data : [])
    } catch (error) {
      console.error('Error fetching clients:', error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  const handleSearch = useMemo(() => throttle(fetchClients, 300), [fetchClients])

  const handleChange = (event, newValue) => {
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
      setQuery(value.full_name)
      setSelectedClient(value)
      onClientSelect(value) // Immediately call onClientSelect with the selected client
      onClose() // Close the modal or perform any necessary cleanup
    } else {
      setQuery('')
      setSelectedClient(null)
    }
  }

  return (
    <>
      <Autocomplete
        options={results}
        getOptionLabel={option => option.full_name || ''}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        onInputChange={handleChange}
        onChange={handleSelect}
        inputValue={query}
        autoHighlight
        filterOptions={x => x}
        loading={loading}
        noOptionsText={'No clients found'}
        renderInput={params => (
          <CustomTextField
            {...params}
            label={
              <>
                <SearchIcon />
                Find client by name
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
              <InitialsAvatar fullName={option.full_name} />
              <Box ml={2}>
                <Typography variant='body1' component='div' fontWeight='bold'>
                  {option.full_name}
                </Typography>
                <Typography variant='body2' color='textSecondary'>
                  {option.email}
                </Typography>
              </Box>
            </Box>
          </li>
        )}
      />
    </>
  )
}

export default ClientSearch
