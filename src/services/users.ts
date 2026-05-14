export const fetchUsers =  ({pageParam} : {pageParam : number}) =>{
    return fetch(`https://randomuser.me/api?results=10&seed=midudev&page=${pageParam}`)
      .then(res => {
        if(!res.ok) throw new Error ('Error')
          return res.json()
       
      })
      .then(res => {
        const currentPage = Number(res.info.page);
        const nextCursor = currentPage > 3 ? undefined : currentPage + 1
        return{
          users: res.results,
          nextCursor
        }
      })
  }