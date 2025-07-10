"use client"

import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface IntensityChartProps {
    data: { step: string; intensity: number }[];
}

export function IntensityChart({ data }: IntensityChartProps) {
  const chartConfig = {
    intensity: {
      label: "Intensidade",
      color: "hsl(var(--accent))",
    },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gráfico de Intensidade Dramática</CardTitle>
        <CardDescription>
          Visualização da intensidade emocional ao longo da jornada do herói.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <LineChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="step"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value, index) => `${index + 1}`}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={[0, 100]}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="intensity"
              type="monotone"
              stroke="var(--color-intensity)"
              strokeWidth={2}
              dot={true}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
                <TrendingUp className="h-4 w-4" /> Variação da Tensão Narrativa
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
                Os números no eixo X correspondem aos 12 passos da jornada.
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
