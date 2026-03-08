'use client'

import { AuthInput } from "./AuthInput";
import { publicApiClient, SIGNIN, useMutation, useQuery, getMe } from "@repo/gql"
import { RootState, setAuthUser, toggleAuthModal, useAppDispatch, useAppSelector, useDispatch } from "@repo/reduxSetup";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const dispatch = useAppDispatch()
  const { redirect } = useAppSelector((state: RootState) => state.authSlice);

  const router = useRouter()

  const meQuery = useQuery({
    queryKey: ['me'],
    queryFn: getMe,
    enabled: false, // call manually after login
  });

  const mutation = useMutation({
    mutationFn: (data: { email: string, password: string }) => SIGNIN(data),
    onSuccess: async (data) => {
      const user = await meQuery.refetch();
      dispatch(toggleAuthModal())
      dispatch(setAuthUser(user.data.me))
      if (redirect === "user-progress-page") {
        router.replace(`/progress?userId=${user.data.me.sub}`)
      }
    },
    onError: (err) => {
      console.error("Error saving:", err);
    }
  })

  const handleSignin = async () => {
    mutation.mutate(
      { email: 'asd1243', password: 'asd' }
    )
  }

  return (
    <form className="flex flex-col h-full justify-between" onSubmit={(e) => e.preventDefault()}>
      <div>
        <div className="mb-6 p-3 border-l-2 border-teal-glow bg-teal-glow/5 text-teal-glow text-xs font-mono">
          {'>'} Please identify yourself to access the mainframe.
        </div>
        <AuthInput label="User_ID / Email" type="text" placeholder="ENTER_IDENTITY..." />
        <AuthInput label="Passcode" type="password" placeholder="ENTER_SECRET..." />

        <div className="flex justify-between items-center mt-2 mb-6">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" className="appearance-none w-3 h-3 border border-surface-600 bg-surface-950 checked:bg-teal-glow checked:border-teal-glow" />
            <span className="text-[10px] text-text-secondary group-hover:text-teal-glow transition-colors">REMEMBER_SESSION</span>
          </label>
          <button className="text-[10px] text-teal-glow hover:text-white underline decoration-teal-glow/30">RECOVER_ACCESS?</button>
        </div>
      </div>

      <button className="
        w-full bg-teal-glow text-surface-950 font-black uppercase tracking-[0.2em] py-3 text-xs
        hover:bg-white transition-all shadow-[4px_4px_0px_rgba(0,0,0,0.3)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
        onClick={handleSignin}
      >
        [ Initialize_Login ]
      </button>
    </form>
  )
}
