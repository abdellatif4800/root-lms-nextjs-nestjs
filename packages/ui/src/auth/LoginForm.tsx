'use client'

import { AuthInput } from "./AuthInput";
import { SIGNIN, useMutation, useQuery, getMe, LOGOUT } from "@repo/gql"
import { RootState, setAuthUser, setUnAuthorized, toggleAuthModal, useAppDispatch, useAppSelector } from "@repo/reduxSetup";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm({ isPublic }: { isPublic: boolean }) {
  const dispatch = useAppDispatch()
  const { redirect } = useAppSelector((state: RootState) => state.authSlice);
  const router = useRouter()

  const [email, setEmail] = useState(isPublic ? "test@mail.com" : "admin101@mail.com");
  const [password, setPassword] = useState("pass123");

  const meQuery = useQuery({
    queryKey: ['me'],
    queryFn: getMe,
    enabled: false,
  });

  const mutation = useMutation({
    mutationFn: (data: { email: string, password: string }) => SIGNIN(data),
    onSuccess: async (data) => {
      const user = await meQuery.refetch();
      if (isPublic === false && user.data?.me?.role !== "ADMIN") {
        await LOGOUT();
        dispatch(setUnAuthorized());
        return;
      }

      dispatch(toggleAuthModal())
      dispatch(setAuthUser(user.data.me))
      if (redirect === "user-progress-page") {
        router.replace(`/progress?userId=${user.data.me.sub}`)
      }
    },
    onError: (err) => {
      console.error("Login error:", err);
    }
  })

  const handleSignin = async () => {
    mutation.mutate({ email, password });
  }

  return (
    <form className="flex flex-col h-full justify-between font-sans" onSubmit={(e) => e.preventDefault()}>
      <div>
        <div className="mb-8 p-4 border-2 border-ink border-dashed text-ink text-xs font-bold bg-surface/30">
          Please enter your details to sign in to your account.
        </div>
        
        <AuthInput
          label="Email Address"
          type="text"
          placeholder="e.g. name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        
        <AuthInput
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="flex justify-between items-center mt-2 mb-8">
          <label className="flex items-center gap-2 cursor-pointer group">
            <div className="relative">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-4 h-4 border-2 border-ink bg-background peer-checked:bg-ink transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center text-background opacity-0 peer-checked:opacity-100 pointer-events-none">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M20 6L9 17L4 12" /></svg>
              </div>
            </div>
            <span className="text-[10px] font-black uppercase text-dust group-hover:text-ink transition-colors">Keep me signed in</span>
          </label>
          <button className="text-[10px] font-black uppercase text-teal-primary hover:text-ink underline underline-offset-2">Forgot Password?</button>
        </div>
      </div>

      <button className="btn-wire-teal w-full py-4 text-xs font-black tracking-widest uppercase"
        onClick={handleSignin}
      >
        {mutation.isPending ? 'Signing In...' : 'Sign In'}
      </button>
    </form>
  )
}
