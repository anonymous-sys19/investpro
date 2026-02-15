"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { GrowthChart } from "@/components/growth-chart";
import {
  ArrowLeft,
  Plus,
  Calendar,
  DollarSign,
  TrendingUp,
  Target,
  FileText,
} from "lucide-react";
import {
  formatCurrency,
  calculateCurrentBalance,
  generateProjection,
  getMonthlyHistory,
} from "@/lib/calculations";
import type { Contribution, EntityWithContributions } from "@/lib/db";
import { Pencil, Trash2 } from "lucide-react";
interface EntityDetailProps {
  entity: EntityWithContributions;
  onBack: () => void;
  onAddContribution: () => void;
  onEditContribution: (contribution: Contribution) => void; // AÑADIR
  onDeleteContribution: (id: string) => void; // AÑADIR
}

export function EntityDetail({
  entity,
  onBack,
  onAddContribution,
  onEditContribution,
  onDeleteContribution,
}: EntityDetailProps) {
  const currentBalance = calculateCurrentBalance(
    entity.initial_capital,
    entity.annual_interest,
    entity.created_at,
    entity.contributions,
  );

  const totalContributions = entity.contributions.reduce(
    (sum, c) => sum + c.amount,
    0,
  );
  const interestEarned =
    currentBalance - entity.initial_capital - totalContributions;
  const goalProgress =
    entity.savings_goal > 0
      ? Math.min((currentBalance / entity.savings_goal) * 100, 100)
      : 0;
  const remaining = Math.max(entity.savings_goal - currentBalance, 0);
  const monthlyRate = (entity.annual_interest / 12).toFixed(4);
  const dailyRate = (entity.annual_interest / 365).toFixed(4);
  const lastContributionDate =
    entity.contributions.length > 0
      ? new Date(
          Math.max(
            ...entity.contributions.map((c) =>
              new Date(c.created_at).getTime(),
            ),
          ),
        )
      : null;

  const projections = generateProjection(
    entity.initial_capital,
    entity.annual_interest,
    entity.created_at,
    entity.contributions,
    12,
  );

  const history = getMonthlyHistory(
    entity.initial_capital,
    entity.annual_interest,
    entity.created_at,
    entity.contributions,
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-muted-foreground hover:text-foreground rounded-xl"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
        <Button
          onClick={onAddContribution}
          className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Aporte
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20">
          <DollarSign className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            {entity.bank_name}
          </h2>
          <p className="text-sm text-muted-foreground">
            {"Inicio: "}
            {new Date(entity.created_at).toLocaleDateString("es-CR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass rounded-3xl border-primary/20">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Balance Actual</p>
            <p className="text-xl font-bold text-primary">
              {formatCurrency(currentBalance)}
            </p>
          </CardContent>
        </Card>
        <Card className="glass rounded-3xl border-accent/20">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">
              Intereses Ganados
            </p>
            <p className="text-xl font-bold text-accent">
              {formatCurrency(interestEarned)}
            </p>
          </CardContent>
        </Card>
        <Card className="glass rounded-3xl border-border/50">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Total Aportes</p>

            <p className="text-xl font-bold text-foreground">
              {formatCurrency(totalContributions)}
            </p>

            {/* fecha del ultimo aporte */}
            {lastContributionDate && (
              <p className="text-xs text-muted-foreground mb-1">
                UA:{" "}
                {lastContributionDate.toLocaleDateString("es-CR")}
              </p>
            )}
          </CardContent>
        </Card>
        <Card className="glass rounded-3xl border-chart-3/20">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Tasa Anual</p>
            <p className="text-xl font-bold text-chart-3">
              {entity.annual_interest}%
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {monthlyRate}% mensual
            </p>
            <p className="text-xs text-muted-foreground">{dailyRate}% diario</p>
          </CardContent>
        </Card>
      </div>

      {/* Goal Progress */}
      <Card className="glass rounded-3xl border-border/50">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-medium text-foreground">
              Progreso hacia la Meta
            </h3>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              {formatCurrency(currentBalance)} de{" "}
              {formatCurrency(entity.savings_goal)}
            </span>
            <span className="text-sm font-semibold text-primary">
              {goalProgress.toFixed(1)}%
            </span>
          </div>
          <Progress value={goalProgress} className="h-3 bg-muted" />
          {remaining > 0 && (
            <p className="text-xs text-muted-foreground mt-2">
              {"Faltan "}
              <span className="text-accent font-medium">
                {formatCurrency(remaining)}
              </span>
              {" para alcanzar tu meta"}
            </p>
          )}
          {remaining === 0 && (
            <p className="text-xs text-primary mt-2 font-medium">
              {"Meta alcanzada!"}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Projection Chart */}
      <GrowthChart
        projections={projections}
        title="Proyeccion a 12 Meses (Interes Compuesto)"
      />

      {/* Projection Table */}
      <Card className="glass rounded-3xl border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <CardTitle className="text-sm font-medium text-foreground">
              Tabla de Proyeccion (12 Meses)
            </CardTitle>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Cálculo con capitalización diaria: {dailyRate}% (anual{" "}
            {entity.annual_interest}%)
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm" role="table">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-2 px-3 text-xs text-muted-foreground font-medium">
                    Mes
                  </th>
                  <th className="text-right py-2 px-3 text-xs text-muted-foreground font-medium">
                    Saldo Inicial
                  </th>
                  <th className="text-right py-2 px-3 text-xs text-muted-foreground font-medium">
                    Ganancia Mensual
                  </th>
                  <th className="text-right py-2 px-3 text-xs text-muted-foreground font-medium">
                    Saldo Final
                  </th>
                </tr>
              </thead>
              <tbody>
                {projections.map((p) => (
                  <tr
                    key={p.month}
                    className="border-b border-border/30 hover:bg-muted/30 transition-colors"
                  >
                    <td className="py-2 px-3 text-foreground">{p.label}</td>
                    <td className="py-2 px-3 text-right text-muted-foreground">
                      {formatCurrency(p.startBalance)}
                    </td>
                    <td className="py-2 px-3 text-right text-primary">
                      +{formatCurrency(p.interest)}
                    </td>
                    <td className="py-2 px-3 text-right text-foreground font-medium">
                      {formatCurrency(p.endBalance)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Real History Table */}
      {history.length > 0 && (
        <Card className="glass rounded-3xl border-border/50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-accent" />
              <CardTitle className="text-sm font-medium text-foreground">
                Historial Real (Mes a Mes)
              </CardTitle>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Calculo real con aportes e intereses acumulados cada mes
            </p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm" role="table">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left py-2 px-3 text-xs text-muted-foreground font-medium">
                      Mes
                    </th>
                    <th className="text-right py-2 px-3 text-xs text-muted-foreground font-medium">
                      Saldo Inicio
                    </th>
                    <th className="text-right py-2 px-3 text-xs text-muted-foreground font-medium">
                      Ganancia
                    </th>
                    <th className="text-right py-2 px-3 text-xs text-muted-foreground font-medium">
                      Aportes
                    </th>
                    <th className="text-right py-2 px-3 text-xs text-muted-foreground font-medium">
                      Saldo Final
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((h) => (
                    <tr
                      key={h.month}
                      className="border-b border-border/30 hover:bg-muted/30 transition-colors"
                    >
                      <td className="py-2 px-3 text-foreground">{h.label}</td>
                      <td className="py-2 px-3 text-right text-muted-foreground">
                        {formatCurrency(h.startBalance)}
                      </td>
                      <td className="py-2 px-3 text-right text-primary">
                        {h.interest > 0
                          ? `+${formatCurrency(h.interest)}`
                          : "-"}
                      </td>
                      <td className="py-2 px-3 text-right text-accent">
                        {h.contributions > 0
                          ? `+${formatCurrency(h.contributions)}`
                          : "-"}
                      </td>
                      <td className="py-2 px-3 text-right text-foreground font-medium">
                        {formatCurrency(h.endBalance)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contributions List */}
      <Card className="glass rounded-3xl border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-accent" />
              <CardTitle className="text-sm font-medium text-foreground">
                Aportes Registrados ({entity.contributions.length})
              </CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {entity.contributions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No hay aportes registrados aun.
            </p>
          ) : (
            <div className="space-y-2">
              {entity.contributions.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors group"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                      <DollarSign className="w-4 h-4 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        +{formatCurrency(c.amount)}
                      </p>
                      {c.note && (
                        <p className="text-xs text-muted-foreground">
                          {c.note}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground mr-3">
                      {new Date(c.created_at).toLocaleString("es-CR", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>

                    {/* Botones Edit/Delete - Se muestran en hover */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditContribution(c)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity h-8 px-2"
                    >
                      <Pencil className="w-3 h-3" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteContribution(c.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity h-8 px-2 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
