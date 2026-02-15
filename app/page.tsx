"use client";

import Link from "next/link";
import { useAuth } from "@/components/auth-provider";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  TrendingUp,
  BarChart3,
  Shield,
  Zap,
  ArrowRight,
  Landmark,
} from "lucide-react";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Si está logueado, redirigir a dashboard
  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin">
          <TrendingUp className="w-8 h-8 text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border/50 glass">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 border border-primary/20">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground tracking-tight">
                InvestPro
              </h1>
              <p className="text-xs text-muted-foreground">
                Dashboard de Inversiones
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" className="rounded-xl">
                Iniciar Sesión
              </Button>
            </Link>
            <Link href="/register">
              <Button className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90">
                Registrarse
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <div className="inline-block mb-6">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20">
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6 tracking-tight">
            Gestiona tus Inversiones de Forma Inteligente
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            InvestPro es tu dashboard profesional para rastrear múltiples bancos
            y entidades financieras con cálculo automático de interés compuesto
            día a día.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/register">
              <Button className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 text-base">
                Comenzar Ahora
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/login">
              <Button
                variant="ghost"
                className="rounded-xl h-12 px-8 text-base"
              >
                Ya tengo cuenta
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-5xl mx-auto mb-20">
          <h3 className="text-3xl font-bold text-foreground text-center mb-12">
            Características Principales
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <Card className="glass rounded-3xl border-border/50 p-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 mb-4">
                <Landmark className="w-6 h-6 text-primary" />
              </div>
              <h4 className="text-lg font-semibold text-foreground mb-2">
                Multi-Banco
              </h4>
              <p className="text-sm text-muted-foreground">
                Gestiona múltiples bancos y entidades financieras en un solo
                lugar.
              </p>
            </Card>

            {/* Feature 2 */}
            <Card className="glass rounded-3xl border-border/50 p-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 mb-4">
                <BarChart3 className="w-6 h-6 text-accent" />
              </div>
              <h4 className="text-lg font-semibold text-foreground mb-2">
                Cálculo Diario
              </h4>
              <p className="text-sm text-muted-foreground">
                Interés compuesto calculado automáticamente día a día con
                precisión.
              </p>
            </Card>

            {/* Feature 3 */}
            <Card className="glass rounded-3xl border-border/50 p-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-chart-3/10 border border-chart-3/20 mb-4">
                <Shield className="w-6 h-6 text-chart-3" />
              </div>
              <h4 className="text-lg font-semibold text-foreground mb-2">
                Seguro
              </h4>
              <p className="text-sm text-muted-foreground">
                Tus datos están protegidos con autenticación y encriptación.
              </p>
            </Card>

            {/* Feature 4 */}
            <Card className="glass rounded-3xl border-border/50 p-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 mb-4">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h4 className="text-lg font-semibold text-foreground mb-2">
                Proyecciones
              </h4>
              <p className="text-sm text-muted-foreground">
                Visualiza proyecciones a 12 meses con gráficas interactivas.
              </p>
            </Card>

            {/* Feature 5 */}
            <Card className="glass rounded-3xl border-border/50 p-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 mb-4">
                <Zap className="w-6 h-6 text-accent" />
              </div>
              <h4 className="text-lg font-semibold text-foreground mb-2">
                Rápido
              </h4>
              <p className="text-sm text-muted-foreground">
                Interfaz veloz y responsiva en todos tus dispositivos.
              </p>
            </Card>

            {/* Feature 6 */}
            <Card className="glass rounded-3xl border-border/50 p-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-chart-3/10 border border-chart-3/20 mb-4">
                <BarChart3 className="w-6 h-6 text-chart-3" />
              </div>
              <h4 className="text-lg font-semibold text-foreground mb-2">
                Análisis Detallado
              </h4>
              <p className="text-sm text-muted-foreground">
                Historial mes a mes y análisis detallado de tus inversiones.
              </p>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-3xl mx-auto bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-3xl p-12 text-center mb-20">
          <h3 className="text-3xl font-bold text-foreground mb-4">
            Comienza a Invertir Hoy
          </h3>
          <p className="text-muted-foreground mb-8">
            Únete a cientos de usuarios que ya confían en InvestPro para
            gestionar sus inversiones.
          </p>
          <Link href="/register">
            <Button className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 text-base">
              Crear Cuenta Gratis
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-6 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            {"Desarrollado por: "}
            <span className="text-foreground font-medium">Anonimo-sys19</span>
            {" | Contacto: "}
            <span className="text-primary font-medium">
              WhatsApp 62228271 +CR
            </span>
          </p>
        </div>
      </footer>
    </div>
  );
}
