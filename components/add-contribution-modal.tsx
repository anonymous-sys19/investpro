"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Contribution } from "@/lib/db";

interface AddContributionModalProps {
  open: boolean;
  entityId: string | null;
  onOpenChange: (open: boolean) => void;
  onSave: (contribution: Contribution) => void;
}

export function AddContributionModal({
  open,
  entityId,
  onOpenChange,
  onSave,
}: AddContributionModalProps) {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setAmount("");
      setNote("");
      setDate("");
    }
    onOpenChange(newOpen);
  };

  const handleSave = async () => {
    if (!entityId || !amount) return;

    setLoading(true);
    try {
      // Convertir fecha local a ISO correctamente
      let createdAtISO = new Date().toISOString();
      if (date) {
        // date viene en formato YYYY-MM-DD
        // Crear fecha a medianoche en zona horaria local
        const [year, month, day] = date.split("-");
        const localDate = new Date(
          Number(year),
          Number(month) - 1,
          Number(day),
        );
        createdAtISO = localDate.toISOString();
      }

      const res = await fetch("/api/contributions", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entityId,
          amount: Number(amount),
          note: note || null,
          createdAt: createdAtISO,
        }),
      });

      if (!res.ok) throw new Error("Failed to create contribution");

      const created = await res.json();
      onSave(created);
      handleOpenChange(false);
    } catch (error) {
      console.error("Error creating contribution:", error);
      alert("Error al crear el aporte");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-2xl">
        <DialogHeader>
          <DialogTitle>Nuevo Aporte</DialogTitle>
          <DialogDescription>
            Agrega un nuevo aporte a tu inversión
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="amount">Monto</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="rounded-lg"
            />
          </div>

          <div>
            <Label htmlFor="date">Fecha del Aporte</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-lg"
            />
          </div>

          <div>
            <Label htmlFor="note">Descripción (opcional)</Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ej: Aporte mensual febrero"
              className="rounded-lg resize-none"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            className="rounded-lg"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading || !amount}
            className="rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {loading ? "Guardando..." : "Agregar Aporte"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
