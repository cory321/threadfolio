'use client'

import { useState, useTransition } from 'react'

import { useAuth } from '@clerk/nextjs'
import { Box, Button, TextField } from '@mui/material'

import { addTodoAction } from '@actions/todo'

const AddTodoForm = ({ setTodos }) => {
  const { userId, getToken } = useAuth()
  const [newTodo, setNewTodo] = useState('')
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async e => {
    e.preventDefault()
    if (newTodo === '') return

    const token = await getToken({ template: 'supabase' })

    startTransition(async () => {
      try {
        const newTodoItem = await addTodoAction(userId, newTodo, token)

        setTodos(prevTodos => (prevTodos ? [...prevTodos, newTodoItem] : [newTodoItem]))
        setNewTodo('')
      } catch (error) {
        console.error('Error adding todo:', error)
      }
    })
  }

  return (
    <Box component='form' onSubmit={handleSubmit} display='flex' alignItems='center'>
      <TextField onChange={e => setNewTodo(e.target.value)} value={newTodo} />
      <Button type='submit' disabled={isPending}>
        {isPending ? 'Adding...' : 'Add Todo'}
      </Button>
    </Box>
  )
}

export default AddTodoForm
