'use client'

import { useState } from "react";
import { AuthInput } from "./AuthInput";
import { useMutation, REGISTER } from "@repo/gql";

export function RegisterForm() {
  // 1. Create state variables for the three inputs
  const [username, setUsername] = useState("user101");
  const [email, setEmail] = useState("test@mail.com");
  const [password, setPassword] = useState("pass123");

  // 2. Add a loading state for better UX
  const [isLoading, setIsLoading] = useState(false);

  /* Example mutation setup:*/
  const mutation = useMutation({
    mutationFn: (data: { username: string, email: string, password: string }) => REGISTER(data),
    onSuccess: (data) => {
      // Handle success (e.g., auto-login, show success message, or close modal)
      setIsLoading(false);
    },
    onError: (err) => {
      console.error("Registration failed:", err);
      setIsLoading(false);
    }
  })

  const handleRegister = async () => {
    setIsLoading(true); // Disable the button immediately

    mutation.mutate({ username, email, password });

    setTimeout(() => setIsLoading(false), 2000);
  }

  return (
    <form className="flex flex-col h-full justify-between" onSubmit={(e) => e.preventDefault()}>
      <div>
        <div className="mb-6 p-3 border-l-2 border-purple-glow bg-purple-glow/5 text-purple-glow text-xs font-mono">
          {'>'} Create new node identity.
        </div>

        {/* Hook up the state and onChange handlers */}
        <AuthInput
          label="Designation (Username)"
          type="text"
          placeholder="ASSIGN_HANDLE..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <AuthInput
          label="Contact_Frequency (Email)"
          type="email"
          placeholder="LINK_ADDRESS..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <AuthInput
          label="Security_Key"
          type="password"
          placeholder="SET_SECRET..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button
        className={`
          mt-4 w-full bg-transparent border border-purple-glow text-purple-glow font-black uppercase tracking-[0.2em] py-3 text-xs
          transition-all shadow-[4px_4px_0px_rgba(0,0,0,0.3)]
          ${isLoading
            ? 'opacity-60 cursor-not-allowed' // Disabled styles
            : 'hover:bg-purple-glow hover:text-surface-950 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none' // Active styles
          }
        `}
        onClick={handleRegister}
        disabled={isLoading}
      >
        {isLoading ? "[ ENCRYPTING... ]" : "[ Execute_Registration ]"}
      </button>
    </form>
  )
}
