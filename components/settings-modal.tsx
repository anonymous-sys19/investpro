"use client";

import { useState } from "react";
import {
  Moon,
  Sun,
  Bell,
  Lock,
  Download,
  Globe,
  Database,
  Eye,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "next-themes";

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [dataAnalytics, setDataAnalytics] = useState(true);
  const [currency, setCurrency] = useState("CRC");
  const [timezone, setTimezone] = useState("America/Costa_Rica");
  const [isExporting, setIsExporting] = useState(false);

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      // Aquí iría la lógica para exportar datos como JSON o CSV
      const userData = {
        exported_at: new Date().toISOString(),
        note: "Los datos serán descargados como JSON",
      };
      const json = JSON.stringify(userData, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `investpro-backup-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al exportar:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAccount = () => {
    if (
      confirm(
        "⚠️ Esta acción es irreversible. ¿Estás seguro de que deseas eliminar tu cuenta y todos tus datos?",
      )
    ) {
      // Aquí iría la lógica para eliminar cuenta
      console.log("Eliminando cuenta...");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] rounded-2xl glass border-border/50 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Configuración</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Theme Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">
              Apariencia
            </h3>

            <div className="p-4 rounded-xl bg-muted/30 border border-border/50 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {theme === "dark" ? (
                    <Moon className="w-5 h-5 text-primary" />
                  ) : (
                    <Sun className="w-5 h-5 text-yellow-500" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-foreground">Tema</p>
                    <p className="text-xs text-muted-foreground">
                      {theme === "dark" ? "Oscuro (Recomendado)" : "Claro"}
                    </p>
                  </div>
                </div>
                <Select value={theme} onValueChange={(v) => setTheme(v)}>
                  <SelectTrigger className="w-24 h-9 rounded-lg bg-background/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Claro</SelectItem>
                    <SelectItem value="dark">Oscuro</SelectItem>
                    <SelectItem value="system">Sistema</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Regional Settings */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">
              Configuración Regional
            </h3>

            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Moneda
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Formato de valores
                      </p>
                    </div>
                  </div>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger className="w-24 h-9 rounded-lg bg-background/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CRC">₡ CRC</SelectItem>
                      <SelectItem value="USD">$ USD</SelectItem>
                      <SelectItem value="EUR">€ EUR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Zona Horaria
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Para cálculos diarios
                      </p>
                    </div>
                  </div>
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger className="w-40 h-9 rounded-lg bg-background/50 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Costa_Rica">
                        Costa Rica
                      </SelectItem>
                      <SelectItem value="America/Mexico_City">
                        México
                      </SelectItem>
                      <SelectItem value="America/New_York">
                        Nueva York
                      </SelectItem>
                      <SelectItem value="Europe/Madrid">España</SelectItem>
                      <SelectItem value="America/Bogota">Colombia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Notifications Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">
              Notificaciones
            </h3>

            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-muted/30 border border-border/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Notificaciones en el App
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Alertas de hitos alcanzados
                    </p>
                  </div>
                </div>
                <Switch
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
              </div>

              <div className="p-4 rounded-xl bg-muted/30 border border-border/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Notificaciones por Email
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Resúmenes mensuales
                    </p>
                  </div>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>
            </div>
          </div>

          {/* Privacy & Data Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">
              Privacidad y Datos
            </h3>

            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-muted/30 border border-border/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Analytics Anónimos
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Ayuda a mejorar el app
                    </p>
                  </div>
                </div>
                <Switch
                  checked={dataAnalytics}
                  onCheckedChange={setDataAnalytics}
                />
              </div>

              <Button
                onClick={handleExportData}
                disabled={isExporting}
                variant="outline"
                className="w-full rounded-lg border-primary/30 hover:bg-primary/10 justify-start"
              >
                <Download className="w-4 h-4 mr-2" />
                {isExporting ? "Exportando..." : "Descargar mis Datos"}
              </Button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="space-y-4 pt-4 border-t border-border/50">
            <h3 className="text-sm font-semibold text-destructive">
              Zona de Peligro
            </h3>

            <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/30 space-y-3">
              <p className="text-sm text-muted-foreground">
                Estas acciones son irreversibles. Procede con cuidado.
              </p>

              <Button
                onClick={handleDeleteAccount}
                variant="outline"
                className="w-full rounded-lg border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive justify-start"
              >
                <Database className="w-4 h-4 mr-2" />
                Eliminar Cuenta Permanentemente
              </Button>
            </div>
          </div>

          {/* Footer Info */}
          <div className="p-4 rounded-xl bg-muted/30 border border-border/50 text-center">
            <p className="text-xs text-muted-foreground">
              Versión 1.0.0 • Construído con ❤️ para tus inversiones
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
