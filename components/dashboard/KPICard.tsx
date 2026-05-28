'use client';

import { Card } from '@/components/ui/card';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: number | string;
  unit?: string;
  trend?: {
    direction: 'up' | 'down';
    percentage: number;
  };
  sparklineData?: Array<{ value: number }>;
  isLoading?: boolean;
}

export function KPICard({
  title,
  value,
  unit,
  trend,
  sparklineData,
  isLoading,
}: KPICardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-1 mt-2">
              <p className="text-3xl font-bold">{isLoading ? '—' : value}</p>
              {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
            </div>
          </div>
          {trend && (
            <div
              className={`flex items-center gap-1 text-sm font-medium ${
                trend.direction === 'up' ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {trend.direction === 'up' ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span>{trend.percentage}%</span>
            </div>
          )}
        </div>

        {sparklineData && sparklineData.length > 0 && (
          <div className="mt-4 -mx-2">
            <ResponsiveContainer width="100%" height={40}>
              <LineChart data={sparklineData}>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'transparent',
                    border: 'none',
                  }}
                  cursor={false}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#3b82f6"
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </Card>
  );
}
