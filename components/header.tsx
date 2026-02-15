"use client";

import { TrendingUp, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth-provider";

export function Header() {
  const { user, logout } = useAuth();

  return (
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
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span>En vivo</span>
          </div>
          {user && (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end">
                <p className="text-sm font-medium text-foreground">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              <Button
                onClick={logout}
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-destructive rounded-xl"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar sesión
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
