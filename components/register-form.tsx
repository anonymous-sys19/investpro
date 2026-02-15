"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, User, Loader2 } from "lucide-react";

export function RegisterForm() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Error al registrarse");
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

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="firstName">Nombre</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              id="firstName"
              placeholder="Juan"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="pl-10 rounded-xl"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Apellido</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              id="lastName"
              placeholder="Pérez"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="pl-10 rounded-xl"
              required
            />
          </div>
        </div>
      </div>

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
        <p className="text-xs text-muted-foreground">Mínimo 6 caracteres</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
            Creando cuenta...
          </>
        ) : (
          "Registrarse"
        )}
      </Button>
    </form>
  );
}
