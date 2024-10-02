'use client'

import { useState } from 'react'

import { useAuth } from '@clerk/nextjs'
import { Box, Button, TextField } from '@mui/material'

import { addTodo } from '@/app/actions/todos'

const AddTodoForm = ({ setTodos }) => {
  const { userId } = useAuth()
  const [newTodo, setNewTodo] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    if (newTodo === '') return

    setIsLoading(true)

    try {
      const newTodoItem = await addTodo(userId, newTodo)

      setTodos(prevTodos => (prevTodos ? [...prevTodos, newTodoItem] : [newTodoItem]))
      setNewTodo('')
    } catch (error) {
      console.error('Error adding todo:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box component='form' onSubmit={handleSubmit} display='flex' alignItems='center' mb={2}>
      <TextField
        onChange={e => setNewTodo(e.target.value)}
        value={newTodo}
        disabled={isLoading}
        fullWidth
        placeholder='Add a new task...'
        size='small'
        sx={{ mr: 2 }}
      />
      <Button type='submit' variant='contained' color='primary' disabled={isLoading} sx={{ whiteSpace: 'nowrap' }}>
        Add Todo
      </Button>
    </Box>
  )
}

export default AddTodoForm
