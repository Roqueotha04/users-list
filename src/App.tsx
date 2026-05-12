import { useMemo, useState } from 'react'
import { SortBy, type User } from './types.d'
import './App.css'
import { UserList } from './components/users'
import { useInfiniteQuery } from '@tanstack/react-query'

  const fetchUsers =  ({pageParam = 1} : {pageParam?: unknown}) =>{
    return fetch(`https://randomuser.me/api?results=10&seed=midudev&page=${pageParam}`)
      .then(res => {
        if(!res.ok) throw new Error ('Error')
          return res.json()
       
      })
      .then(res => ({
        users: res.results,
        nextCursor: res.info.page +1
      }))
  }

function App() {

  const {isLoading, isError, data, refetch, fetchNextPage, hasNextPage } = useInfiniteQuery<{nextCursor: number, users: User[]}>({
    queryKey: ['users'],
    queryFn: fetchUsers,
    initialPageParam:1,
    getNextPageParam: (lastPage) => lastPage.nextCursor
  })
  
  const users : User [] = data?.pages?.flatMap(page => page.users) ?? []

  const [showColors, setShowColors] = useState (false)
  const [sorting, setSorting] = useState<SortBy> (SortBy.NONE)
  const [filterCountry, setFilterCountry] = useState<string | null> (null)
//  const originalUsers = useRef<User[]>([])

  const [currentPage, setCurrentPage] = useState (1)

  const toggleColors = () => {
    setShowColors (!showColors)
  }

  const toggleOrderByCountry = () =>{
    const newSortingValue = sorting == SortBy.NONE ? SortBy.COUNTRY : SortBy.NONE
    setSorting(newSortingValue)
  }

  const toggleDelete = (email : string) =>{
//    const filteredUsers = users.filter((user) =>{
//      return user.email != email
//    })
//    setUsers(filteredUsers)
  }

  const toggleReset = () =>{
    refetch()
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
        
        { users.length > 0 && <UserList changeSorting={toggleChangeSorting} deleteUser={toggleDelete} showColors={showColors} users={sortedUsers}></UserList>}
        {isLoading && <p>Cargando...</p>}
        {!isLoading && isError && <p>Ocurrio un error</p>}
        {!isLoading && !isError && users.length == 0 && <p>No hay usuarios</p>}
      
        
        {!isLoading && !isError && <button onClick={() => fetchNextPage()}>Cargar mas resultados</button>}
      </main>
      
   </>
  )
}

export default App
