import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/login")({
  component: AdminLogin,
});

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      toast.error("Αποτυχία σύνδεσης: " + error.message);
    } else {
      toast.success("Καλώς όρισες, Yolte");
      navigate({ to: "/admin/dashboard" });
    }
  };

  return (
    <div className="flex min-h-[80svh] items-center justify-center px-5">
      <form onSubmit={handleLogin} className="w-full max-w-md rounded-2xl border border-border/70 bg-card p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-violet-chrome">Admin Portal</h1>
        <p className="mt-2 text-sm text-muted-foreground text-purple-200/50">Είσοδος μόνο για εξουσιοδοτημένους χρήστες.</p>
        
        <div className="mt-8 space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full rounded-lg border border-border bg-background p-3 text-sm outline-none focus:border-accent"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Κωδικός"
            className="w-full rounded-lg border border-border bg-background p-3 text-sm outline-none focus:border-accent"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="w-full rounded-full bg-accent py-3 text-xs font-bold tracking-[0.2em] text-white uppercase hover:opacity-90">
            Είσοδος
          </button>
        </div>
      </form>
    </div>
  );
}
