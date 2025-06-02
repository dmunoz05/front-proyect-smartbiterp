import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DollarSign, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import axios from "axios";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [moneyTotal, setMoneyTotal] = useState([]);
  const [moneyMonth, setMoneyMonth] = useState([]);
  const [expenseMonth, setExpenseMonth] = useState([]);
  const [budgetTotal, setBudgetTotal] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);

  const getMoneyTotal = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/server/v1/g/dashboard-money-total"
      );
      setMoneyTotal(response.data[0]);
    } catch (error) {
      console.error("Error fetching deposits:", error);
    }
  };

  const getMoneyMonth = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/server/v1/g/dashboard-money-month"
      );
      setMoneyMonth(response.data[0]);
    } catch (error) {
      console.error("Error fetching deposits:", error);
    }
  };

  const getExpenseMonth = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/server/v1/g/dashboard-expense-month"
      );
      setExpenseMonth(response.data[0]);
    } catch (error) {
      console.error("Error fetching deposits:", error);
    }
  };

  const getBudgetTotal = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/server/v1/g/dashboard-budget-total"
      );
      setBudgetTotal(response.data[0]);
    } catch (error) {
      console.error("Error fetching deposits:", error);
    }
  };

  const getRecentTransactions = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/server/v1/g/dashboard-recent-transactions"
      );
      setRecentTransactions(response.data);
    } catch (error) {
      console.error("Error fetching deposits:", error);
    }
  };

  useEffect(() => {
    getMoneyTotal();
    getMoneyMonth();
    getExpenseMonth();
    getBudgetTotal();
    getRecentTransactions();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo total</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${Intl.NumberFormat("es-CO").format(moneyTotal.TotalIngresos)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ingresos mensuales
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {Intl.NumberFormat("es-CO").format(
                moneyMonth.TotalIngresosDelMes
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Gastos mensuales
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${Intl.NumberFormat("es-CO").format(expenseMonth.TotalGastos)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Presupuesto restante
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {Intl.NumberFormat("es-CO").format(
                budgetTotal.TotalPresupuestado
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Transacciones recientes</CardTitle>
            <CardDescription>
              Sus últimos registros de gastos y depósitos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      {item.TipoTransaccion === "Gasto"
                        ? item.Comercio
                        : "Depósito"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {item.TipoTransaccion === "Gasto"
                        ? item.NombreGasto
                        : item.NombreFondo}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-medium ${
                        item.TipoTransaccion === "Gasto"
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      {item.TipoTransaccion === "Gasto"
                        ? `-$${Intl.NumberFormat("es-CO").format(item.Monto)}`
                        : `+$${Intl.NumberFormat("es-CO").format(item.Monto)}`}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(item.Fecha).toLocaleDateString("es-CO", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
