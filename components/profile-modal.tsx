"use client";

import { useState } from "react";
import { X, Mail, Calendar, Shield, Edit2, Save } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/components/auth-provider";

interface ProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileModal({ open, onOpenChange }: ProfileModalProps) {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form states
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      // Aquí irían las llamadas a API para actualizar el perfil
      // Por ahora es placeholder
      console.log("Guardando perfil:", { firstName, lastName });
      setIsEditing(false);
    } catch (error) {
      console.error("Error al guardar:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    if (newPassword.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);
    try {
      // Aquí iría la llamada a API para cambiar contraseña
      console.log("Cambiando contraseña");
      setIsChangingPassword(false);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Error al cambiar contraseña:", error);
    } finally {
      setLoading(false);
    }
  };

  const registrationDate = new Date(2026, 1, 15).toLocaleDateString("es-CR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

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
  const hash =
    user?.email?.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) ||
    0;
  const avatarColor = colors[hash % colors.length];

  const initials =
    `${user?.firstName?.charAt(0) || ""}${user?.lastName?.charAt(0) || ""}`.toUpperCase();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] rounded-2xl glass border-border/50 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Mi Perfil</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-4">
            <div
              className={`${avatarColor} w-20 h-20 rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-lg`}
            >
              {initials}
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-foreground">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>

          {/* Account Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-primary" />
                <p className="text-xs text-muted-foreground">Miembro desde</p>
              </div>
              <p className="text-sm font-semibold text-foreground">
                {registrationDate}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-accent" />
                <p className="text-xs text-muted-foreground">Estado</p>
              </div>
              <p className="text-sm font-semibold text-foreground">Activo ✓</p>
            </div>
          </div>

          {/* Edit Profile Section */}
          {!isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              className="w-full rounded-lg border-primary/30 hover:bg-primary/10"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Editar Información Personal
            </Button>
          ) : (
            <div className="space-y-4 p-4 rounded-xl bg-muted/30 border border-border/50">
              <h3 className="font-semibold text-foreground">
                Editar Información Personal
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-xs">
                    Nombre
                  </Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Tu nombre"
                    className="rounded-lg bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-xs">
                    Apellido
                  </Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Tu apellido"
                    className="rounded-lg bg-background/50"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  onClick={() => setIsEditing(false)}
                  variant="outline"
                  size="sm"
                  className="rounded-lg"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSaveProfile}
                  disabled={loading}
                  size="sm"
                  className="rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? "Guardando..." : "Guardar"}
                </Button>
              </div>
            </div>
          )}

          {/* Change Password Section */}
          {!isChangingPassword ? (
            <Button
              onClick={() => setIsChangingPassword(true)}
              variant="outline"
              className="w-full rounded-lg border-primary/30 hover:bg-primary/10"
            >
              <Shield className="w-4 h-4 mr-2" />
              Cambiar Contraseña
            </Button>
          ) : (
            <div className="space-y-4 p-4 rounded-xl bg-muted/30 border border-border/50">
              <h3 className="font-semibold text-foreground">
                Cambiar Contraseña
              </h3>

              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="oldPassword" className="text-xs">
                    Contraseña Actual
                  </Label>
                  <Input
                    id="oldPassword"
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Tu contraseña actual"
                    className="rounded-lg bg-background/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-xs">
                    Nueva Contraseña
                  </Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Nueva contraseña (mín. 6 caracteres)"
                    className="rounded-lg bg-background/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-xs">
                    Confirmar Contraseña
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirma tu nueva contraseña"
                    className="rounded-lg bg-background/50"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  onClick={() => setIsChangingPassword(false)}
                  variant="outline"
                  size="sm"
                  className="rounded-lg"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleChangePassword}
                  disabled={loading}
                  size="sm"
                  className="rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {loading ? "Cambiando..." : "Cambiar Contraseña"}
                </Button>
              </div>
            </div>
          )}

          {/* Security Info */}
          <div className="p-4 rounded-xl bg-accent/10 border border-accent/30">
            <div className="flex gap-2">
              <Shield className="w-5 h-5 text-accent flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Mantén tu cuenta segura
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Usa una contraseña fuerte y única. Nunca compartas tus
                  credenciales con terceros.
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
