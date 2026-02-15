"use client";

import { useState, useCallback } from "react";
import useSWR from "swr";
import { useAuth } from "@/components/auth-provider";
import { SummaryCards } from "@/components/summary-cards";
import { EntityCard } from "@/components/entity-card";
import { EntityDetail } from "@/components/entity-detail";
import { GrowthChart } from "@/components/growth-chart";
import { AddEntityModal } from "@/components/add-entity-modal";
import { AddContributionModal } from "@/components/add-contribution-modal";
// import { EditContributionModal } from "@/components/edit-contribution-modal";
import { EditContributionModal } from "./edit-contribution-modal";
import { Button } from "@/components/ui/button";
import { Plus, Landmark, RefreshCw } from "lucide-react";
import {
  calculateCurrentBalance,
  generateProjection,
} from "@/lib/calculations";
import type { EntityWithContributions, Contribution } from "@/lib/db";

const fetcher = async (url: string) => {
  const res = await fetch(url, {
    credentials: "include", // Incluir cookies
  });
  if (!res.ok) {
    const info = await res.json().catch(() => ({}));
    const error = new Error(info.error || "Request failed");
    throw error;
  }
  return res.json();
};

export function Dashboard() {
  const { loading: authLoading } = useAuth();
  const {
    data: entities,
    error,
    mutate,
    isLoading,
  } = useSWR<EntityWithContributions[]>("/api/entities", fetcher, {
    refreshInterval: 30000,
  });

  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
  const [showAddEntity, setShowAddEntity] = useState(false);
  const [contributionEntityId, setContributionEntityId] = useState<
    string | null
  >(null);
  const [editingContribution, setEditingContribution] =
    useState<Contribution | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const handleAddEntity = useCallback(
    async (data: {
      bankName: string;
      initialCapital: number;
      annualInterest: number;
      savingsGoal: number;
      createdAt: string;
    }) => {
      const res = await fetch("/api/entities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const info = await res.json().catch(() => ({}));
        throw new Error(info.error || "Failed to create entity");
      }
      await mutate();
      setShowAddEntity(false);
    },
    [mutate],
  );

  const handleAddContribution = useCallback(
    async (contribution: Contribution) => {
      console.log(
        "[v1] handleAddContribution received contribution:",
        contribution,
      );
      await mutate();
      setContributionEntityId(null);
    },
    [mutate],
  );

  const handleDeleteEntity = useCallback(
    async (entityId: string) => {
      const confirmed = window.confirm(
        "Estas seguro de eliminar esta entidad? Se borraran todos sus aportes.",
      );
      if (!confirmed) return;
      const res = await fetch(`/api/entities/${entityId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        await mutate();
        if (selectedEntityId === entityId) setSelectedEntityId(null);
      }
    },
    [mutate, selectedEntityId],
  );

  // Manejador de eliminación
  const handleDeleteContribution = async (contributionId: string) => {
    if (!confirm("¿Seguro que deseas eliminar este aporte?")) return;

    try {
      const res = await fetch(`/api/contributions?id=${contributionId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to delete");

      // Refrescar datos
      mutate();
    } catch (error) {
      console.error("Error deleting contribution:", error);
      alert("Error al eliminar el aporte");
    }
  };

  // Manejador de edición
  const handleEditContribution = (contribution: Contribution) => {
    setEditingContribution(contribution);
    setEditModalOpen(true);
  };

  // Después de guardar edición
  const handleSaveContribution = () => {
    setEditModalOpen(false);
    setEditingContribution(null);
    mutate(); // Refrescar datos
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-6 h-6 text-primary animate-spin" />
          <p className="text-sm text-muted-foreground">
            Cargando inversiones...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-sm text-destructive mb-2">
            Error al cargar los datos
          </p>
          <Button
            variant="ghost"
            onClick={() => mutate()}
            className="text-muted-foreground rounded-xl"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  const entitiesList = Array.isArray(entities) ? entities : [];
  const selectedEntity = entitiesList.find((e) => e.id === selectedEntityId);
  const contributionEntity = entitiesList.find(
    (e) => e.id === contributionEntityId,
  );

  // Calculate totals
  const totalBalance = entitiesList.reduce((sum, e) => {
    return (
      sum +
      calculateCurrentBalance(
        e.initial_capital,
        e.annual_interest,
        e.created_at,
        e.contributions,
      )
    );
  }, 0);

  const totalCapital = entitiesList.reduce(
    (sum, e) => sum + e.initial_capital,
    0,
  );
  const totalContributions = entitiesList.reduce(
    (sum, e) => sum + e.contributions.reduce((cs, c) => cs + c.amount, 0),
    0,
  );
  const totalInterestEarned = totalBalance - totalCapital - totalContributions;
  const totalGoal = entitiesList.reduce((sum, e) => sum + e.savings_goal, 0);

  // Aggregate projection for chart
  const aggregateProjections =
    entitiesList.length > 0
      ? (() => {
          const allProjections = entitiesList.map((e) =>
            generateProjection(
              e.initial_capital,
              e.annual_interest,
              e.created_at,
              e.contributions,
              12,
            ),
          );

          return allProjections[0].map((_, i) => ({
            ...allProjections[0][i],
            startBalance: allProjections.reduce(
              (sum, p) => sum + p[i].startBalance,
              0,
            ),
            interest: allProjections.reduce((sum, p) => sum + p[i].interest, 0),
            endBalance: allProjections.reduce(
              (sum, p) => sum + p[i].endBalance,
              0,
            ),
            contributions: 0,
          }));
        })()
      : [];

  if (selectedEntity) {
    return (
      <>
        <EntityDetail
          entity={selectedEntity}
          onBack={() => setSelectedEntityId(null)}
          onAddContribution={() => setContributionEntityId(selectedEntity.id)}
          onEditContribution={handleEditContribution}
          onDeleteContribution={handleDeleteContribution}
        />
        <AddContributionModal
          open={contributionEntityId === selectedEntity.id}
          onOpenChange={(open) => {
            if (!open) setContributionEntityId(null);
          }}
          entityId={contributionEntityId}
          onSave={handleAddContribution}
        />
      </>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <SummaryCards
          totalBalance={totalBalance}
          totalInterestEarned={totalInterestEarned}
          totalGoal={totalGoal}
          entityCount={entitiesList.length}
        />

        {entitiesList.length > 0 && aggregateProjections.length > 0 && (
          <GrowthChart
            projections={aggregateProjections}
            title="Proyeccion Global de Crecimiento (12 Meses)"
          />
        )}

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Mis Entidades
            </h2>
            <p className="text-xs text-muted-foreground">
              {entitiesList.length === 0
                ? "Agrega tu primera entidad bancaria"
                : `${entitiesList.length} entidad${entitiesList.length > 1 ? "es" : ""} registrada${entitiesList.length > 1 ? "s" : ""}`}
            </p>
          </div>
          <Button
            onClick={() => setShowAddEntity(true)}
            className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nueva Entidad
          </Button>
        </div>

        {entitiesList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 glass rounded-3xl border-dashed border-2 border-border/50">
            <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
              <Landmark className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-sm mb-4">
              No hay entidades registradas
            </p>
            <Button
              onClick={() => setShowAddEntity(true)}
              className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Crear Primera Entidad
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {entitiesList.map((entity) => (
              <EntityCard
                key={entity.id}
                entity={entity}
                onAddContribution={(id) => setContributionEntityId(id)}
                onDelete={handleDeleteEntity}
                onSelect={(id) => setSelectedEntityId(id)}
              />
            ))}
          </div>
        )}
      </div>

      <AddEntityModal
        open={showAddEntity}
        onClose={() => setShowAddEntity(false)}
        onAdd={handleAddEntity}
      />

      <AddContributionModal
        open={!!contributionEntityId && !selectedEntity}
        onOpenChange={(open) => {
          if (!open) setContributionEntityId(null);
        }}
        entityId={contributionEntityId}
        onSave={handleAddContribution}
      />

      <EditContributionModal
        open={editModalOpen}
        contribution={editingContribution}
        onOpenChange={setEditModalOpen}
        onSave={handleSaveContribution}
      />
    </>
  );
}
