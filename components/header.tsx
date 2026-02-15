"use client";

import { useState } from "react";
import { TrendingUp, LogOut, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAuth } from "@/components/auth-provider";
import { ProfileModal } from "@/components/profile-modal";
import { SettingsModal } from "@/components/settings-modal";

function getInitials(firstName: string, lastName: string): string {
  return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
}

function getAvatarColor(email: string): string {
  const colors = [
    "bg-blue-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-red-500",
    "bg-indigo-500",
    "bg-cyan-500",
  ];
  const hash = email
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
}

export function Header() {
  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const initials = user ? getInitials(user.firstName, user.lastName) : "";
  const avatarColor = user ? getAvatarColor(user.email) : "";

  return (
    <header className="border-b border-border/50 glass sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 border border-primary/20">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <div>
            {/* <h1 className="text-lg font-bold text-foreground tracking-tight">
              InvestPro
            </h1> */}
            <h1 className="text-3xl font-black text-emerald-500 tracking-tight">
              INVEST<span className="text-white">PRO</span>
            </h1>
            <p className="text-xs text-muted-foreground hidden sm:block">
              Dashboard de Inversiones
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Status En Vivo */}
          <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span>En vivo</span>
          </div>

          {/* User Menu */}
          {user && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full p-0 w-10 h-10 hover:bg-primary/10"
                >
                  <div
                    className={`${avatarColor} w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md hover:shadow-lg transition-shadow`}
                  >
                    {initials}
                  </div>
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-64 p-0 rounded-2xl border-border/50 glass">
                {/* Header del Popover */}
                <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 border-b border-border/50">
                  <div className="flex items-center gap-3">
                    <div
                      className={`${avatarColor} w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md`}
                    >
                      {initials}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="p-3 space-y-2">
                  <Button
                    onClick={() => {
                      setProfileOpen(true);
                    }}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-foreground hover:bg-primary/10 rounded-lg"
                  >
                    <User className="w-4 h-4 mr-2" />
                    <span>Mi Perfil</span>
                  </Button>

                  <Button
                    onClick={() => {
                      setSettingsOpen(true);
                    }}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-foreground hover:bg-primary/10 rounded-lg"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    <span>Configuración</span>
                  </Button>
                </div>

                {/* Divider */}
                <div className="border-t border-border/50" />

                {/* Logout Button */}
                <div className="p-3">
                  <Button
                    onClick={logout}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-destructive hover:bg-destructive/10 rounded-lg"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    <span>Cerrar sesión</span>
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>

      {/* Modals */}
      <ProfileModal open={profileOpen} onOpenChange={setProfileOpen} />
      <SettingsModal open={settingsOpen} onOpenChange={setSettingsOpen} />
    </header>
  );
}
