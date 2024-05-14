'use client'

import { useState } from 'react'

import { useUser } from '@clerk/nextjs'

import AddTodoForm from '@/components/todo/AddTodoForm'
import TodoList from '@/components/todo/TodoList'

export default function Home() {
  const { isSignedIn, isLoading, user } = useUser()
  const [todos, setTodos] = useState(null)

  return (
    <>
      {isLoading ? (
        <></>
      ) : (
        <main>
          <div>
            {isSignedIn ? (
              <>
                <h1>Welcome {user.firstName}</h1>
                <AddTodoForm todos={todos} setTodos={setTodos} />
                <TodoList todos={todos} setTodos={setTodos} />
              </>
            ) : (
              <div>Sign in to create your todo list!</div>
            )}
          </div>
        </main>
      )}
    </>
  )
}
