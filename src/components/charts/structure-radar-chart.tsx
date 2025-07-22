
"use client"

import { Award } from "lucide-react"
import { PolarGrid, PolarAngleAxis, Radar, RadarChart, ResponsiveContainer } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface StructureRadarChartProps {
    data: { criteria: string; score: number }[];
}

export function StructureRadarChart({ data }: StructureRadarChartProps) {

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Award /> Radar de Estrutura</CardTitle>
        <CardDescription>
          Representação visual das pontuações de cada critério estrutural.
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-8">
        <ResponsiveContainer width="100%" height={250}>
          <RadarChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              bottom: 10,
              left: 10,
            }}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <PolarGrid />
            <PolarAngleAxis dataKey="criteria" />
            <Radar
              name="Pontuação"
              dataKey="score"
              fill="hsl(var(--primary))"
              fillOpacity={0.6}
              stroke="hsl(var(--primary))"
              domain={[0, 10]}
            />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
