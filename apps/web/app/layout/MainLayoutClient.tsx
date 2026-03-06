"use client"

import { useEffect } from "react";
import { AuthComponent } from "@repo/ui"
import { RootState, setAuthUser, setUnAuthorized, useAppDispatch, useAppSelector, useDispatch, useSelector } from "@repo/reduxSetup";
import { publicApiClient, SIGNIN, useMutation, useQuery, getMe } from "@repo/gql"


export default function MainLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const isAuthModalOpen = useAppSelector((state: RootState) => state.authSlice.isModalOpend)



  const dispatch = useAppDispatch()

  const meQuery = useQuery({
    queryKey: ['me'],
    queryFn: getMe,
    enabled: false, // call manually after login
  });



  useEffect(() => {
    async function fetchUser() {
      try {
        const { data, errors } = await meQuery.refetch();

        if (errors || !data?.me) {
          dispatch(setUnAuthorized());
          return;
        }


        dispatch(setAuthUser(data.me));
      } catch (err) {
        dispatch(setUnAuthorized())
      }
    }

    fetchUser();
  }, [])


  return (
    <>
      {isAuthModalOpen && <AuthComponent isPublic={true} />}
      {children}
    </>
  )
}
