import { useState, useContext } from "react";
import AppContext from "@context/app-context";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Search } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

export default function BudgetComparisonPage() {
  const context = useContext(AppContext);
  const urlApi = context.urlApi;
  const [comparisonData, setComparisonData] = useState([]);
  const [totalBudgeted, setTotalBudgeted] = useState(0);
  const [totalNow, setTotalNow] = useState(0);
  const [diference, setDifference] = useState(0);

  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });

  const chartConfig = {
    budgeted: {
      label: "Presupuesto",
      color: "hsl(var(--chart-1))",
    },
    actual: {
      label: "Actual",
      color: "hsl(var(--chart-2))",
    },
  };

  const getTotals = () => {
    try {
      axios.get(`${urlApi}/g/total/comparison`).then((response) => {
        if (response.status === 200) {
          setTotalBudgeted(response.data[0].Monto_Presupuesto);
          setTotalNow(response.data[0].Monto_Deposito);
          setDifference(
            response.data[0].Monto_Deposito - response.data[0].Monto_Presupuesto
          );
          toast.success("Datos de comparación actualizados con éxito");
          return "Filtrado con éxito";
        } else {
          throw new Error(
            "Error al obtener los datos: " + response.data.message
          );
        }
      }),
        {
          loading: "Creando deposito...",
          success: (msg) => msg,
          error: (err) => err.message || "Error en la solicitud",
        };
    } catch (error) {
      console.error("Error saving deposit:", error);
    }
  };

  const handleFilterComparison = async (e) => {
    e.preventDefault();
    try {
      const filtersDate = {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      };
      toast.promise(
        axios.post(`${urlApi}/g/comparison`, filtersDate).then((response) => {
          if (response.status === 200) {
            getTotals();
            setComparisonData(response.data);
            toast.success("Datos de comparación actualizados con éxito");
            return "Filtrado con éxito";
          } else {
            throw new Error(
              "Error al obtener los datos: " + response.data.message
            );
          }
        }),
        {
          loading: "Creando deposito...",
          success: (msg) => msg,
          error: (err) => err.message || "Error en la solicitud",
        }
      );
    } catch (error) {
      console.error("Error saving deposit:", error);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Comparación entre presupuesto y ejecución</CardTitle>
          <CardDescription>
            Comparar los montos presupuestados con los gastos reales por
            categoría
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="startDate">Fecha de inicio</Label>
              <Input
                id="startDate"
                type="date"
                value={dateRange.startDate}
                onChange={(e) =>
                  setDateRange((prev) => ({
                    ...prev,
                    startDate: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Fecha de fin</Label>
              <Input
                id="endDate"
                type="date"
                value={dateRange.endDate}
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, endDate: e.target.value }))
                }
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={handleFilterComparison}
                className="w-full md:w-auto"
              >
                <Search className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
            </div>
          </div>

          {totalBudgeted != 0 && totalNow != 0 && comparisonData.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">
                        Total Presupuestado
                      </p>
                      <p className="text-2xl font-bold">
                        ${Intl.NumberFormat("es-CO").format(totalBudgeted)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">
                        Total Actual
                      </p>
                      <p className="text-2xl font-bold">
                        ${Intl.NumberFormat("es-CO").format(totalNow)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">
                        Diferencia
                      </p>
                      <p
                        className={`text-2xl font-bold ${
                          diference >= 0 ? "text-red-600" : "text-green-600"
                        }`}
                      >
                        {diference >= 0 ? "+" : ""}$
                        {Intl.NumberFormat("es-CO").format(diference)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Gráfico de presupuesto vs. real</CardTitle>
                  <CardDescription>
                    Comparación visual de gastos presupuestados y reales por
                    categoría
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={chartConfig}
                    className="min-h-[400px]"
                  >
                    <BarChart
                      data={comparisonData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="TipoGasto"
                        tick={{ fontSize: 12 }}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar
                        dataKey="Presupuesto"
                        fill="var(--color-presupuesto)"
                        name="Presupuesto"
                      />
                      <Bar
                        dataKey="GastoActual"
                        fill="var(--color-actual)"
                        name="GastoActual"
                      />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Comparación detallada</CardTitle>
                  <CardDescription>
                    Comparación línea por línea con análisis de varianza
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {comparisonData.map((item) => {
                      return (
                        <div
                          key={item.expenseType}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div>
                            <h4 className="font-medium">{item.TipoGasto}</h4>
                            <div className="flex gap-4 text-sm text-muted-foreground">
                              <span>
                                Budgeted: $
                                {Intl.NumberFormat("es-CO").format(
                                  item.Presupuesto
                                )}
                              </span>
                              <span>
                                Actual: $
                                {Intl.NumberFormat("es-CO").format(
                                  item.GastoActual
                                )}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p
                              className={`font-medium ${
                                item.Diferencia >= 0
                                  ? "text-red-600"
                                  : "text-green-600"
                              }`}
                            >
                              {item.Diferencia >= 0 ? "+" : ""}$
                              {Intl.NumberFormat("es-CO").format(
                                item.Diferencia
                              )}
                            </p>
                            <p
                              className={`text-sm ${
                                item.Diferencia >= 0
                                  ? "text-red-600"
                                  : "text-green-600"
                              }`}
                            >
                              {item.Diferencia >= 0 ? "+" : ""}
                              {item.Porcentaje}%
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
