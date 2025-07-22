
"use client"

import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface IntensityChartProps {
    data: { step: string; intensity: number; label: string }[];
}

export function IntensityChart({ data }: IntensityChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gráfico de Intensidade Dramática</CardTitle>
        <CardDescription>
          Visualização da intensidade emocional ao longo da jornada do herói.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
              top: 5,
              bottom: 80,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              angle={-45}
              textAnchor="end"
              interval={0}
              tickFormatter={(value) => {
                const stepName = value.split('. ').slice(1).join('. ');
                return stepName.length > 15 ? `${stepName.substring(0, 15)}...` : stepName
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={[0, 100]}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="p-2 border rounded-lg bg-background shadow-lg">
                      <p className="font-bold">{label}</p>
                      <p className="text-sm text-primary">{`Intensidade: ${payload[0].value}`}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line
              dataKey="intensity"
              type="monotone"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={true}
              name="Intensidade"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
                <TrendingUp className="h-4 w-4" /> Variação da Tensão Narrativa
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
                O eixo X mostra os passos da jornada identificados no roteiro.
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
