'use client'

import { useState, useEffect } from 'react'

import { createClient } from '@supabase/supabase-js'
import { useAuth, useUser, UserButton, SignInButton, SignUpButton, useSession } from '@clerk/nextjs'

const supabaseClient = async supabaseAccessToken => {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_KEY, {
    global: { headers: { Authorization: `Bearer ${supabaseAccessToken}` } }
  })

  return supabase
}

const TodoList = ({ todos, setTodos }) => {
  const { session } = useSession()
  const [loading, setLoading] = useState(true)

  // on first load, fetch and set todos
  useEffect(() => {
    const loadTodos = async () => {
      try {
        setLoading(true)

        const supabaseAccessToken = await session.getToken({
          template: 'supabase'
        })

        const supabase = await supabaseClient(supabaseAccessToken)
        const { data: todos } = await supabase.from('todos').select('*')

        setTodos(todos)
      } catch (e) {
        alert(e)
      } finally {
        setLoading(false)
      }
    }

    loadTodos()
  }, [])

  // if loading, just show basic message
  if (loading) {
    return <div>Loading...</div>
  }

  // display all the todos
  return (
    <>
      {todos?.length > 0 ? (
        <div>
          <ol>
            {todos.map(todo => (
              <li key={todo.id}>{todo.title}</li>
            ))}
          </ol>
        </div>
      ) : (
        <div>You dont have any todos!</div>
      )}
    </>
  )
}

function AddTodoForm({ todos, setTodos }) {
  const { getToken, userId } = useAuth()
  const [newTodo, setNewTodo] = useState('')

  const handleSubmit = async e => {
    e.preventDefault()

    if (newTodo === '') {
      return
    }

    const supabaseAccessToken = await getToken({
      template: 'supabase'
    })

    const supabase = await supabaseClient(supabaseAccessToken)
    const { data } = await supabase.from('todos').insert({ title: newTodo, user_id: userId }).select()

    setTodos([...todos, data[0]])
    setNewTodo('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <input onChange={e => setNewTodo(e.target.value)} value={newTodo} />
      &nbsp;<button>Add Todo</button>
    </form>
  )
}

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
