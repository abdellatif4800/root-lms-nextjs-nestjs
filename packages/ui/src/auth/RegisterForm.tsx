import { AuthInput } from "./AuthInput";

export function RegisterForm() {
  return (
    <form className="flex flex-col h-full justify-between" onSubmit={(e) => e.preventDefault()}>
      <div>
        <div className="mb-6 p-3 border-l-2 border-purple-glow bg-purple-glow/5 text-purple-glow text-xs font-mono">
          {'>'} Create new node identity.
        </div>
        <AuthInput label="Designation (Username)" type="text" placeholder="ASSIGN_HANDLE..." />
        <AuthInput label="Contact_Frequency (Email)" type="email" placeholder="LINK_ADDRESS..." />
        <AuthInput label="Security_Key" type="password" placeholder="SET_SECRET..." />
      </div>

      <button className="
        mt-4 w-full bg-transparent border border-purple-glow text-purple-glow font-black uppercase tracking-[0.2em] py-3 text-xs
        hover:bg-purple-glow hover:text-surface-950 transition-all shadow-[4px_4px_0px_rgba(0,0,0,0.3)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none
      ">
        [ Execute_Registration ]
      </button>
    </form>
  )
}
