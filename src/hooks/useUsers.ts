import { fetchUsers } from "../services/users";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useUsers = () =>{

    const {isLoading, isError, data, refetch, fetchNextPage, hasNextPage} = useInfiniteQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    getNextPageParam:(lastPage) => lastPage.nextCursor,
    initialPageParam: 1
  })

  return{
    isLoading,
    isError,
    users : data?.pages?.flatMap(page => page.users) ?? [],
    refetch,
    fetchNextPage,
    hasNextPage
  }
}
    