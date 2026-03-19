"use client"

import { useEffect, useState } from "react";
import { AuthComponent } from "@repo/ui"
import { RootState, setAuthUser, setUnAuthorized, useAppDispatch, useAppSelector } from "@repo/reduxSetup";
import { useQuery, getMe, LOGOUT } from "@repo/gql"

export default function MainLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const isAuth = useAppSelector((state: RootState) => state.authSlice.isAuth)
  const dispatch = useAppDispatch()

  // Track if we have performed the initial "me" check yet
  const [isInitialCheckDone, setIsInitialCheckDone] = useState(false);

  const { refetch } = useQuery({
    queryKey: ['me'],
    queryFn: getMe,
    enabled: false,
  });

  useEffect(() => {
    async function fetchUser() {
      try {
        const { data } = await refetch();

        if (data?.me && data.me.role === 'ADMIN') {
          // ✅ only set auth if role is ADMIN
          dispatch(setAuthUser(data.me));
        } else {
          // ✅ not admin or no user — clear cookie + redux
          await LOGOUT();
          dispatch(setUnAuthorized());
        }
      } catch (err) {
        dispatch(setUnAuthorized());
      } finally {
        // Now we know if the user is logged in or not
        setIsInitialCheckDone(true);
      }
    }

    fetchUser();
  }, [dispatch, refetch]);

  // 1. Show nothing (or a global loader) while checking for the cookie
  if (!isInitialCheckDone) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-surface-950">
        <div className="font-mono text-[10px] text-teal-glow animate-pulse">
          [ AUTHENTICATING_SESSION... ]
        </div>
      </div>
    );
  }

  // 2. Once checked, decide between the app or the login screen
  return (
    <>
      {isAuth ? children : <AuthComponent isPublic={false} />}
    </>
  )
}

