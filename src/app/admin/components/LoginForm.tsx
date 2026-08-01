"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { FieldControl } from "@/components/FieldControl";
import { Button } from "@/components/Button";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else {
      // Refresh the page to update the server component session state
      window.location.reload();
    }
  };

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full max-w-sm mx-auto text-left">
      {error && (
        <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md">
          {error}
        </div>
      )}
      <FieldControl
        label="Email"
        type="email"
        value={email}
        onChange={setEmail}
        required
      />
      <FieldControl
        label="Password"
        type="password"
        value={password}
        onChange={setPassword}
        required
      />
      <Button
        type="submit"
        disabled={isLoading}
        className="mt-2"
      >
        {isLoading ? "Logging in..." : "Login"}
      </Button>
    </form>
  );
}
