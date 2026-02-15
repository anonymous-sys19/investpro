"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Wallet, TrendingUp, Target, Landmark } from "lucide-react";
import { formatCurrency } from "@/lib/calculations";

interface SummaryCardsProps {
  totalBalance: number;
  totalInterestEarned: number;
  totalGoal: number;
  entityCount: number;
}

export function SummaryCards({
  totalBalance,
  totalInterestEarned,
  totalGoal,
  entityCount,
}: SummaryCardsProps) {
  const goalProgress = totalGoal > 0 ? (totalBalance / totalGoal) * 100 : 0;

  const cards = [
    {
      title: "Balance Total",
      value: formatCurrency(totalBalance),
      icon: Wallet,
      color: "text-primary",
      bgColor: "bg-primary/10",
      borderColor: "border-primary/20",
    },
    {
      title: "Intereses Ganados",
      value: formatCurrency(totalInterestEarned),
      icon: TrendingUp,
      color: "text-accent",
      bgColor: "bg-accent/10",
      borderColor: "border-accent/20",
    },
    {
      title: "Meta Global",
      value: `${Math.min(goalProgress, 100).toFixed(1)}%`,
      icon: Target,
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
      borderColor: "border-chart-3/20",
    },
    {
      title: "Entidades",
      value: entityCount.toString(),
      icon: Landmark,
      color: "text-muted-foreground",
      bgColor: "bg-muted/50",
      borderColor: "border-border/50",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card
          key={card.title}
          className={`glass glass-hover rounded-3xl ${card.borderColor}`}
        >
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center gap-3 mb-3">
              <div
                className={`flex items-center justify-center w-9 h-9 rounded-xl ${card.bgColor}`}
              >
                <card.icon className={`w-4 h-4 ${card.color}`} />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-1">{card.title}</p>
            <p className={`text-lg lg:text-2xl font-bold ${card.color}`}>
              {card.value}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
