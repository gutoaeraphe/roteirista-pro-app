"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts"

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
  ChartTooltipContent,
} from "@/components/ui/chart"

interface MCVBarChartProps {
    data: { factorName: string; score: number }[];
}

export function MCVBarChart({ data }: MCVBarChartProps) {
  const chartConfig = {
    score: {
      label: "Custo/Complexidade",
      color: "hsl(var(--primary))",
    },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gráfico de Viabilidade</CardTitle>
        <CardDescription>
          Visualização da pontuação de custo e complexidade para cada fator de produção.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart
            accessibilityLayer
            data={data}
            margin={{
              left: -20,
              right: 10,
              top: 5,
              bottom: 20
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="factorName"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              angle={-45}
              textAnchor="end"
              height={80}
              interval={0}
              tickFormatter={(value) => value.length > 15 ? `${value.substring(0, 15)}...` : value}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={[0, 5]}
              allowDecimals={false}
            />
            <Tooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Bar
              dataKey="score"
              fill="var(--color-score)"
              radius={4}
              name="Custo/Complexidade"
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
       <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Valores mais altos indicam maior custo ou complexidade de produção.
        </div>
        <div className="leading-none text-muted-foreground">
          Pontuação de 1 (baixo) a 5 (alto).
        </div>
      </CardFooter>
    </Card>
  )
}
