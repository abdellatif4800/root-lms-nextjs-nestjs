'use client'

import { useState } from "react";
import { AuthInput } from "./AuthInput";
import { useMutation, REGISTER } from "@repo/gql";

export function RegisterForm() {
  const [username, setUsername] = useState("user101");
  const [email, setEmail] = useState("test@mail.com");
  const [password, setPassword] = useState("pass123");
  const [isLoading, setIsLoading] = useState(false);

  const mutation = useMutation({
    mutationFn: (data: { username: string, email: string, password: string }) => REGISTER(data),
    onSuccess: () => {
      setIsLoading(false);
    },
    onError: (err) => {
      console.error("Registration failed:", err);
      setIsLoading(false);
    }
  })

  const handleRegister = async () => {
    setIsLoading(true);
    mutation.mutate({ username, email, password });
    setTimeout(() => setIsLoading(false), 2000);
  }

  return (
    <form className="flex flex-col h-full justify-between font-sans" onSubmit={(e) => e.preventDefault()}>
      <div>
        <div className="mb-8 p-4 border-2 border-ink border-dashed text-ink text-xs font-bold bg-surface/30">
          Create an account to start your learning journey.
        </div>

        <AuthInput
          label="Display Name"
          type="text"
          placeholder="e.g. Alex"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <AuthInput
          label="Email Address"
          type="email"
          placeholder="e.g. name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <AuthInput
          label="Choose Password"
          type="password"
          placeholder="Create a secure password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button
        className={`
          mt-4 w-full py-4 text-xs font-black uppercase tracking-widest transition-all
          ${isLoading ? 'btn-wire opacity-50 cursor-not-allowed' : 'btn-wire-teal'}
        `}
        onClick={handleRegister}
        disabled={isLoading}
      >
        {isLoading ? "Creating Account..." : "Register Now"}
      </button>
    </form>
  )
}
