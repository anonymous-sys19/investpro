"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Landmark, Plus, Trash2, TrendingUp, Calendar } from "lucide-react";
import {
  formatCurrency,
  calculateCurrentBalance,
} from "@/lib/calculations";
import type { EntityWithContributions } from "@/lib/db";

interface EntityCardProps {
  entity: EntityWithContributions;
  onAddContribution: (entityId: string) => void;
  onDelete: (entityId: string) => void;
  onSelect: (entityId: string) => void;
}

export function EntityCard({
  entity,
  onAddContribution,
  onDelete,
  onSelect,
}: EntityCardProps) {
  const currentBalance = calculateCurrentBalance(
    entity.initial_capital,
    entity.annual_interest,
    entity.created_at,
    entity.contributions
  );

  const totalContributions = entity.contributions.reduce(
    (sum, c) => sum + c.amount,
    0
  );
  const interestEarned = currentBalance - entity.initial_capital - totalContributions;
  const goalProgress =
    entity.savings_goal > 0
      ? Math.min((currentBalance / entity.savings_goal) * 100, 100)
      : 0;

  const monthlyRate = (entity.annual_interest / 12).toFixed(4);

  const createdDate = new Date(entity.created_at).toLocaleDateString("es-CR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <Card className="glass glass-hover rounded-3xl group cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div
            className="flex items-center gap-3 flex-1"
            onClick={() => onSelect(entity.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") onSelect(entity.id);
            }}
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 border border-primary/20">
              <Landmark className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold text-foreground">
                {entity.bank_name}
              </CardTitle>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                <Calendar className="w-3 h-3" />
                <span>{createdDate}</span>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(entity.id);
            }}
            aria-label={`Eliminar ${entity.bank_name}`}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4" onClick={() => onSelect(entity.id)}>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Balance Actual</span>
            <span className="text-lg font-bold text-primary">
              {formatCurrency(currentBalance)}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground mb-0.5">Capital Inicial</p>
              <p className="text-sm font-semibold text-foreground">
                {formatCurrency(entity.initial_capital)}
              </p>
            </div>
            <div className="rounded-xl bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground mb-0.5">Intereses</p>
              <p className="text-sm font-semibold text-accent flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {formatCurrency(interestEarned)}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {entity.annual_interest}% anual ({monthlyRate}% mes)
            </span>
            <span>Aportes: {entity.contributions.length}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              Meta: {formatCurrency(entity.savings_goal)}
            </span>
            <span className="text-primary font-medium">
              {goalProgress.toFixed(1)}%
            </span>
          </div>
          <Progress value={goalProgress} className="h-2 bg-muted" />
        </div>

        <Button
          onClick={(e) => {
            e.stopPropagation();
            onAddContribution(entity.id);
          }}
          className="w-full rounded-xl bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20"
          variant="ghost"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Aporte
        </Button>
      </CardContent>
    </Card>
  );
}
