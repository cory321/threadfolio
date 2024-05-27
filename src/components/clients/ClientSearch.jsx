'use client'

import { useState, useTransition, useEffect, useCallback } from 'react'

import debounce from 'lodash/debounce'
import { useAuth } from '@clerk/nextjs'
import { TextField, CircularProgress, Autocomplete } from '@mui/material'

import { searchClients } from '@actions/clients'

const ClientSearch = ({ userId }) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isPending, startTransition] = useTransition()
  const { getToken } = useAuth()
  const [token, setToken] = useState('')
  const [loading, setLoading] = useState(false)
  const [tokenError, setTokenError] = useState(false)

  const fetchToken = useCallback(async () => {
    try {
      const supabaseToken = await getToken({ template: 'supabase' })

      console.log('JWT Token:', supabaseToken) // Log the token to the console
      setToken(supabaseToken)
    } catch (error) {
      setTokenError(true)
      console.error('Error fetching token:', error)
    }
  }, [getToken])

  useEffect(() => {
    fetchToken()
  }, [fetchToken])

  const handleSearch = useCallback(
    debounce(async query => {
      if (token) {
        try {
          setLoading(true)
          const data = await searchClients(query, userId, token)

          setResults(data)
          setLoading(false)
        } catch (error) {
          if (error.message.includes('JWT expired')) {
            setTokenError(true)
          }

          setLoading(false)
          console.error('Error fetching clients:', error)
        }
      }
    }, 300),
    [token, userId]
  )

  const handleChange = (e, newValue) => {
    const newQuery = newValue

    setQuery(newQuery)
    startTransition(() => {
      if (newQuery.length > 2) {
        handleSearch(newQuery)
      } else {
        setResults([])
      }
    })
  }

  const handleSelect = (event, value) => {
    if (value) {
      setQuery(value.full_name)
    }
  }

  if (tokenError) {
    return <p>Error fetching token. Please try again later.</p>
  }

  return (
    <Autocomplete
      freeSolo
      options={results}
      getOptionLabel={option => option.full_name}
      onInputChange={handleChange}
      onChange={handleSelect}
      inputValue={query}
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
                {loading ? <CircularProgress color='inherit' size={20} /> : null}
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
  )
}

export default ClientSearch
