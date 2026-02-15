"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { RegisterForm } from "@/components/register-form";
import { TrendingUp } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 border border-primary/20">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">InvestPro</h1>
          <p className="text-muted-foreground mt-2">Dashboard de Inversiones</p>
        </div>

        {/* Card */}
        <Card className="glass rounded-3xl border-border/50 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground">Crear Cuenta</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Únete a InvestPro y comienza a invertir
            </p>
          </div>

          <RegisterForm />

          {/* Link to Login */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              ¿Ya tienes cuenta?{" "}
              <Link
                href="/login"
                className="text-primary hover:underline font-medium"
              >
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">
            {"Desarrollado por: "}
            <span className="text-foreground font-medium">Anonimo-sys19</span>
            {" | Contacto: "}
            <span className="text-primary font-medium">
              WhatsApp 62228271 +CR
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
