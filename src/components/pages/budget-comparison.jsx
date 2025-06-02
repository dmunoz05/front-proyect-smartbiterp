import { useState } from "react";
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

export default function BudgetComparisonPage() {
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });

  // Mock data for budget vs actual comparison
  const [comparisonData] = useState([
    { expenseType: "Food & Dining", budgeted: 500, actual: 420 },
    { expenseType: "Transportation", budgeted: 300, actual: 280 },
    { expenseType: "Entertainment", budgeted: 200, actual: 250 },
    { expenseType: "Utilities", budgeted: 400, actual: 380 },
    { expenseType: "Healthcare", budgeted: 250, actual: 180 },
  ]);

  const chartConfig = {
    budgeted: {
      label: "Budgeted",
      color: "hsl(var(--chart-1))",
    },
    actual: {
      label: "Actual",
      color: "hsl(var(--chart-2))",
    },
  };

  const getTotalBudgeted = () => {
    return comparisonData.reduce((sum, item) => sum + item.budgeted, 0);
  };

  const getTotalActual = () => {
    return comparisonData.reduce((sum, item) => sum + item.actual, 0);
  };

  const getVariance = () => {
    return getTotalActual() - getTotalBudgeted();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Budget vs Execution Comparison</CardTitle>
          <CardDescription>
            Compare budgeted amounts with actual expenses by category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
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
              <Label htmlFor="endDate">End Date</Label>
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
              <Button>
                <Search className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Total Budgeted
                  </p>
                  <p className="text-2xl font-bold">
                    ${getTotalBudgeted().toFixed(2)}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Total Actual</p>
                  <p className="text-2xl font-bold">
                    ${getTotalActual().toFixed(2)}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Variance</p>
                  <p
                    className={`text-2xl font-bold ${
                      getVariance() >= 0 ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {getVariance() >= 0 ? "+" : ""}${getVariance().toFixed(2)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Budget vs Actual Chart</CardTitle>
              <CardDescription>
                Visual comparison of budgeted vs actual expenses by category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="min-h-[400px]">
                <BarChart
                  data={comparisonData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="expenseType"
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="budgeted"
                    fill="var(--color-budgeted)"
                    name="Budgeted"
                  />
                  <Bar
                    dataKey="actual"
                    fill="var(--color-actual)"
                    name="Actual"
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Detailed Comparison</CardTitle>
              <CardDescription>
                Line-by-line comparison with variance analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {comparisonData.map((item) => {
                  const variance = item.actual - item.budgeted;
                  const variancePercent = (
                    (variance / item.budgeted) *
                    100
                  ).toFixed(1);

                  return (
                    <div
                      key={item.expenseType}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <h4 className="font-medium">{item.expenseType}</h4>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <span>Budgeted: ${item.budgeted.toFixed(2)}</span>
                          <span>Actual: ${item.actual.toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-medium ${
                            variance >= 0 ? "text-red-600" : "text-green-600"
                          }`}
                        >
                          {variance >= 0 ? "+" : ""}${variance.toFixed(2)}
                        </p>
                        <p
                          className={`text-sm ${
                            variance >= 0 ? "text-red-600" : "text-green-600"
                          }`}
                        >
                          {variance >= 0 ? "+" : ""}
                          {variancePercent}%
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
