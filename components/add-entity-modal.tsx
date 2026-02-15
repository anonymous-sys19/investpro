"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Landmark } from "lucide-react";

interface AddEntityModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (data: {
    bankName: string;
    initialCapital: number;
    annualInterest: number;
    savingsGoal: number;
    createdAt: string;
  }) => void;
}

function toLocalDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function AddEntityModal({ open, onClose, onAdd }: AddEntityModalProps) {
  const [bankName, setBankName] = useState("");
  const [initialCapital, setInitialCapital] = useState("");
  const [annualInterest, setAnnualInterest] = useState("");
  const [savingsGoal, setSavingsGoal] = useState("");
  const [startDate, setStartDate] = useState(toLocalDateString(new Date()));
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bankName || !initialCapital || !annualInterest || !savingsGoal) return;

    setLoading(true);
    const dateISO = new Date(startDate + "T00:00:00").toISOString();
    onAdd({
      bankName,
      initialCapital: Number(initialCapital),
      annualInterest: Number(annualInterest),
      savingsGoal: Number(savingsGoal),
      createdAt: dateISO,
    });
    setLoading(false);
    setBankName("");
    setInitialCapital("");
    setAnnualInterest("");
    setSavingsGoal("");
    setStartDate(toLocalDateString(new Date()));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="glass rounded-3xl border-border/50 sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 border border-primary/20">
              <Landmark className="w-5 h-5 text-primary" />
            </div>
            <DialogTitle className="text-foreground">Nueva Entidad</DialogTitle>
          </div>
          <DialogDescription>
            Agrega un banco o entidad financiera para rastrear tu inversion.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bankName" className="text-foreground">
              Nombre del Banco
            </Label>
            <Input
              id="bankName"
              placeholder="Ej: BAC, BCR, Coopeservidores..."
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              className="rounded-xl bg-muted/50 border-border/50 text-foreground placeholder:text-muted-foreground"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="startDate" className="text-foreground">
              Fecha de Inicio del Ahorro
            </Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="rounded-xl bg-muted/50 border-border/50 text-foreground placeholder:text-muted-foreground"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="initialCapital" className="text-foreground">
                Capital Inicial ($)
              </Label>
              <Input
                id="initialCapital"
                type="number"
                step="0.01"
                min="0"
                placeholder="1000.00"
                value={initialCapital}
                onChange={(e) => setInitialCapital(e.target.value)}
                className="rounded-xl bg-muted/50 border-border/50 text-foreground placeholder:text-muted-foreground"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="annualInterest" className="text-foreground">
                Interes Anual (%)
              </Label>
              <Input
                id="annualInterest"
                type="number"
                step="0.01"
                min="0"
                placeholder="5.5"
                value={annualInterest}
                onChange={(e) => setAnnualInterest(e.target.value)}
                className="rounded-xl bg-muted/50 border-border/50 text-foreground placeholder:text-muted-foreground"
                required
              />
              <p className="text-xs text-muted-foreground">
                {"Mensual: "}
                {annualInterest
                  ? (Number(annualInterest) / 12).toFixed(4)
                  : "0.0000"}
                {"%"}
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="savingsGoal" className="text-foreground">
              Meta de Ahorro ($)
            </Label>
            <Input
              id="savingsGoal"
              type="number"
              step="0.01"
              min="0"
              placeholder="10000.00"
              value={savingsGoal}
              onChange={(e) => setSavingsGoal(e.target.value)}
              className="rounded-xl bg-muted/50 border-border/50 text-foreground placeholder:text-muted-foreground"
              required
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="flex-1 rounded-xl text-muted-foreground"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {loading ? "Guardando..." : "Crear Entidad"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
