"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import type { MonthProjection } from "@/lib/calculations";
import { formatCurrency } from "@/lib/calculations";

interface GrowthChartProps {
  projections: MonthProjection[];
  title: string;
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (active && payload && payload.length) {
    return (
      <div className="glass rounded-xl p-3 border border-border/50 text-sm">
        <p className="text-muted-foreground mb-1">{label}</p>
        <p className="text-primary font-semibold">
          {formatCurrency(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
}

export function GrowthChart({ projections, title }: GrowthChartProps) {
  const data = projections.map((p) => ({
    name: p.label,
    balance: Number(p.endBalance.toFixed(2)),
  }));

  return (
    <Card className="glass rounded-3xl border-border/50">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          <CardTitle className="text-sm font-medium text-foreground">
            {title}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(215, 28%, 17%)"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }}
                axisLine={{ stroke: "hsl(215, 28%, 17%)" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="balance"
                stroke="hsl(160, 84%, 39%)"
                strokeWidth={2}
                fill="url(#balanceGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
