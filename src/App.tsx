import { useEffect, useState } from 'react'
import { type User } from './types.d'
import './App.css'
import { UserList } from './components/users'

function App() {
  const [users, setUsers] = useState<User[]>([])

  useEffect(()=>{
    fetch('https://randomuser.me/api?results=100')
      .then(res => res.json())
      .then(res =>{
        setUsers(res.results);
      })
      .catch(err =>{
        console.error(err)
      })
  }, [])

  return (
    <>
      <h1>prueba</h1>
      <UserList users={users}></UserList>
   </>
  )
}

export default App
