'use client'

import { useState } from 'react'

import { useUser } from '@clerk/nextjs'

import AddTodoForm from '@/components/todo/AddTodoForm'
import TodoList from '@/components/todo/TodoList'
import { getGreeting } from '@/utils/greetings'
import { getFormattedDate } from '@/utils/formatDate'

export default function Home() {
  const { user } = useUser()
  const [todos, setTodos] = useState(null)
  const greeting = getGreeting()
  const formattedDate = getFormattedDate()

  return (
    <main>
      <div>
        <p>{formattedDate}</p>
        <h1>
          {greeting}, {user?.firstName}
        </h1>
        <br />
        <h2>To do list</h2>
        <AddTodoForm todos={todos} setTodos={setTodos} />
        <TodoList todos={todos} setTodos={setTodos} />
      </div>
    </main>
  )
}
