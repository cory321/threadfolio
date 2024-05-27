'use client'

import { useState, useTransition } from 'react'

import debounce from 'lodash/debounce'

import { searchClients } from '@actions/clients'

const ClientSearch = ({ userId, token }) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isPending, startTransition] = useTransition()

  const handleSearch = debounce(async query => {
    if (token) {
      const data = await searchClients(query, userId, token)

      setResults(data)
    }
  }, 300)

  const handleChange = e => {
    const newQuery = e.target.value

    setQuery(newQuery)
    startTransition(() => {
      if (newQuery.length > 2) {
        handleSearch(newQuery)
      } else {
        setResults([])
      }
    })
  }

  return (
    <div>
      <input type='text' value={query} onChange={handleChange} placeholder='Search clients' />
      {isPending && <p>Loading...</p>}
      {results.length > 0 && (
        <ul>
          {results.map((result, index) => (
            <li key={index}>
              {result.full_name} ({result.email})
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default ClientSearch
