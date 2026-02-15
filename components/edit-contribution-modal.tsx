"use client";

import { useState, useEffect } from "react";
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

interface EditContributionModalProps {
  open: boolean;
  contribution: Contribution | null;
  onOpenChange: (open: boolean) => void;
  onSave: (updatedContribution: Contribution) => void;
}

export function EditContributionModal({
  open,
  contribution,
  onOpenChange,
  onSave,
}: EditContributionModalProps) {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (contribution) {
      setAmount(String(contribution.amount));
      setNote(contribution.note || "");
      // Convertir a formato YYYY-MM-DD para el input
      const dateObj = new Date(contribution.created_at);
      const localDate = dateObj.toISOString().split("T")[0];
      setDate(localDate);
    }
  }, [contribution, open]);

  const handleSave = async () => {
    if (!contribution || !amount) return;

    setLoading(true);
    try {
      const res = await fetch("/api/contributions", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: contribution.id,
          amount: Number(amount),
          note: note || null,
          createdAt: date
            ? new Date(date).toISOString()
            : contribution.created_at,
        }),
      });

      if (!res.ok) throw new Error("Failed to update contribution");

      const updated = await res.json();
      onSave(updated);
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating contribution:", error);
      alert("Error al actualizar el aporte");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} >
      <DialogContent className="sm:max-w-[425px] rounded-2xl ">
        <DialogHeader>
          <DialogTitle>Editar Aporte</DialogTitle>
          <DialogDescription>
            Modifica los detalles del aporte
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
            <Label htmlFor="date">Fecha</Label>
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
            onClick={() => onOpenChange(false)}
            className="rounded-lg"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading || !amount}
            className="rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {loading ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
