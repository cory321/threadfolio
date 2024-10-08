import React, { useState, useCallback, useMemo } from 'react'

import { Autocomplete, TextField, CircularProgress } from '@mui/material'
import throttle from 'lodash/throttle'

import { searchClients } from '@/app/actions/clients'

const ClientLookup = ({ onClientSelect }) => {
  const [query, setQuery] = useState('')
  const [options, setOptions] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchClients = useCallback(async query => {
    setLoading(true)

    try {
      const data = await searchClients(query)

      setOptions(data.length > 0 ? data : [])
    } catch (error) {
      console.error('Error fetching clients:', error)
      setOptions([])
    } finally {
      setLoading(false)
    }
  }, [])

  const handleSearch = useMemo(() => throttle(fetchClients, 300), [fetchClients])

  const handleInputChange = (event, newInputValue) => {
    setQuery(newInputValue)

    if (newInputValue.length > 1) {
      handleSearch(newInputValue)
    } else {
      setOptions([])
    }
  }

  return (
    <Autocomplete
      options={options}
      getOptionLabel={option => option.full_name || ''}
      renderInput={params => (
        <TextField
          {...params}
          label='Select Client'
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
      onInputChange={handleInputChange}
      onChange={(event, newValue) => {
        onClientSelect(newValue)
      }}
      loading={loading}
      fullWidth
      filterOptions={x => x}
    />
  )
}

export default ClientLookup
