import { useEffect, useMemo, useRef, useState } from 'react'
import { SortBy, type User } from './types.d'
import './App.css'
import { UserList } from './components/users'

function App() {
  const [users, setUsers] = useState<User[]>([])
  const [showColors, setShowColors] = useState (false)
  const [sorting, setSorting] = useState<SortBy> (SortBy.NONE)
  const [filterCountry, setFilterCountry] = useState<string | null> (null)
  const originalUsers = useRef<User[]>([])

  const toggleColors = () => {
    setShowColors (!showColors)
  }

  const toggleOrderByCountry = () =>{
    const newSortingValue = sorting == SortBy.NONE ? SortBy.COUNTRY : SortBy.NONE
    setSorting(newSortingValue)
  }

  const toggleDelete = (email : string) =>{
    const filteredUsers = users.filter((user) =>{
      return user.email != email
    })
    setUsers(filteredUsers)
  }

  const toggleReset = () =>{
    setUsers(originalUsers.current);
    setSorting(SortBy.NONE)
  }

  const toggleFilterCountry = (event: React.ChangeEvent<HTMLInputElement>) =>{
    setFilterCountry(event.target.value)
  }

  const toggleChangeSorting = (sort: SortBy) =>{
    setSorting(sort)
  }

  const filteredUsers = useMemo(() =>{
    return  filterCountry ?
      [...users].filter(user => user.location.country.toLowerCase().includes(filterCountry.toLowerCase()))
      : users
  }, [users, filterCountry])
     

  const sortedUsers = useMemo(()=>{

    if (sorting == SortBy.NONE) return filteredUsers
    if(sorting == SortBy.COUNTRY) {
      return [...filteredUsers].sort((a,b)=>{
      return a.location.country.localeCompare(b.location.country)
    })}
    if(sorting == SortBy.NAME) {
      return [...filteredUsers].sort((a,b)=>{
      return a.name.first.localeCompare(b.name.first)
    })}
    if(sorting == SortBy.LAST) {
      return [...filteredUsers].sort((a,b)=>{
      return a.name.last.localeCompare(b.name.last)
    })}
    return filteredUsers;
  },[filteredUsers, sorting])


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
          {sorting == SortBy.COUNTRY ? 'No ordenar por pais' : 'Ordenar por pais'}
        </button>
        <button onClick={toggleReset}>
          Resetear estado
        </button>
        <input type="text" onChange={toggleFilterCountry} />
      </header>
      <main>
        <UserList changeSorting={toggleChangeSorting} deleteUser={toggleDelete} showColors={showColors} users={sortedUsers}></UserList>
      </main>
      
   </>
  )
}

export default App
