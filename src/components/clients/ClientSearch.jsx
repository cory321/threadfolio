'use client'

import React, { useState, useCallback, useTransition } from 'react'

import throttle from 'lodash/throttle'
import { useAuth } from '@clerk/nextjs'
import { TextField, CircularProgress, Autocomplete } from '@mui/material'

import { searchClients } from '@actions/clients'

const ClientSearch = ({ userId }) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [selectedClientId, setSelectedClientId] = useState(null)
  const { getToken } = useAuth()
  const [loading, setLoading] = useState(false)
  const [isPending, startTransition] = useTransition()

  const fetchClients = useCallback(
    async query => {
      setLoading(true)

      try {
        const token = await getToken({ template: 'supabase' })

        if (token) {
          const data = await searchClients(query, userId, token)

          setResults(data.length > 0 ? data : [])
        }
      } catch (error) {
        console.error('Error fetching clients:', error)
        setResults([])
      } finally {
        setLoading(false)
      }
    },
    [getToken, userId]
  )

  const handleSearch = useCallback(throttle(fetchClients, 300), [fetchClients])

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
      setSelectedClientId(value.id)
    } else {
      setSelectedClientId(null)
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
          <TextField
            {...params}
            label='Search clients'
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
            {option.full_name} ({option.email}) - ID: {option.id}
          </li>
        )}
      />
      {selectedClientId && <p>Selected Client ID: {selectedClientId}</p>}
    </>
  )
}

export default ClientSearch
