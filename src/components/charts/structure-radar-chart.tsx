
"use client"

import { Award } from "lucide-react"
import { PolarGrid, PolarAngleAxis, Radar, RadarChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface StructureRadarChartProps {
    data: { criteria: string; score: number }[];
}

const chartConfig = {
    score: {
      label: "Pontuação",
      color: "hsl(var(--primary))",
    },
};

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
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square h-[250px]"
        >
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
              dataKey="score"
              fill="var(--color-score)"
              fillOpacity={0.6}
              stroke="var(--color-score)"
              domain={[0, 10]}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
