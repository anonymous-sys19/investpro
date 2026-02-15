"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Loader2 } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Error al iniciar sesión");
        setLoading(false);
        return;
      }

      // Success
      router.push("/dashboard");
    } catch (err) {
      setError("Error de conexión");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-destructive/10 border border-destructive rounded-xl p-3">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Gmail</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="tu@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10 rounded-xl"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10 rounded-xl"
            required
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Iniciando sesión...
          </>
        ) : (
          "Iniciar Sesión"
        )}
      </Button>
    </form>
  );
}
