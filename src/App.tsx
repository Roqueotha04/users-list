import { useEffect, useRef, useState } from 'react'
import { type User } from './types.d'
import './App.css'
import { UserList } from './components/users'

function App() {
  const [users, setUsers] = useState<User[]>([])
  const [showColors, setShowColors] = useState (false)
  const [sortByCountry, setSortByCountry] = useState (false)
  const [filterCountry, setFilterCountry] = useState<string | null> (null)
  const originalUsers = useRef<User[]>([])

  const toggleColors = () => {
    setShowColors (!showColors)
  }

  const toggleOrderByCountry = () =>{
      setSortByCountry(prevState => !prevState)
  }

  const toggleDelete = (email : string) =>{
    const filteredUsers = users.filter((user) =>{
      return user.email != email
    })
    setUsers(filteredUsers)
  }

  const toggleReset = () =>{
    setUsers(originalUsers.current);
  }

  const toggleFilterCountry = (event: React.ChangeEvent<HTMLInputElement>) =>{
    setFilterCountry(event.target.value)
  }

  const filteredUsers = filterCountry ?
    [...users].filter(user => user.location.country.toLowerCase().includes(filterCountry.toLowerCase()))
    : users

  const sortedUsers = sortByCountry ?
  filteredUsers.sort((a,b)=>{
     return a.location.country.localeCompare(b.location.country)
  }) :
  filteredUsers

  useEffect(()=>{
    fetch('https://randomuser.me/api?results=100')
      .then(res => res.json())
      .then(res =>{
        setUsers(res.results);
        originalUsers.current=res.results;
      })
      .catch(err =>{
        console.error(err)
      })
  }, [])

  return (
    <>
      <h1>prueba</h1>
      <header>
        <button onClick={toggleColors}>
          Colorear filas
        </button>
        <button onClick={toggleOrderByCountry}>
          {sortByCountry ? 'No ordenar por pais' : 'Ordenar por pais'}
        </button>
        <button onClick={toggleReset}>
          Resetear estado
        </button>
        <input type="text" onChange={toggleFilterCountry} />
      </header>
      <main>
        <UserList deleteUser={toggleDelete} showColors={showColors} users={sortedUsers}></UserList>
      </main>
      
   </>
  )
}

export default App
