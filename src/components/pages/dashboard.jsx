import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DollarSign, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { useEffect, useState, useContext } from "react";
import AppContext from "@context/app-context";
import axios from "axios";

export default function DashboardPage() {
  const context = useContext(AppContext);
  const urlApi = context.urlApi;
  const [moneyTotal, setMoneyTotal] = useState([]);
  const [moneyMonth, setMoneyMonth] = useState([]);
  const [expenseMonth, setExpenseMonth] = useState([]);
  const [budgetTotal, setBudgetTotal] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [comparisonData, setComparisonData] = useState([]);

  const getMoneyTotal = async () => {
    try {
      const response = await axios.get(`${urlApi}/g/dashboard-money-total`);
      setMoneyTotal(response.data[0]);
    } catch (error) {
      console.error("Error fetching deposits:", error);
    }
  };

  const getMoneyMonth = async () => {
    try {
      const response = await axios.get(`${urlApi}/g/dashboard-money-month`);
      setMoneyMonth(response.data[0]);
    } catch (error) {
      console.error("Error fetching deposits:", error);
    }
  };

  const getExpenseMonth = async () => {
    try {
      const response = await axios.get(`${urlApi}/g/dashboard-expense-month`);
      setExpenseMonth(response.data[0]);
    } catch (error) {
      console.error("Error fetching deposits:", error);
    }
  };

  const getBudgetTotal = async () => {
    try {
      const response = await axios.get(`${urlApi}/g/dashboard-budget-total`);
      setBudgetTotal(response.data[0]);
    } catch (error) {
      console.error("Error fetching deposits:", error);
    }
  };

  const getRecentTransactions = async () => {
    try {
      const response = await axios.get(
        `${urlApi}/g/dashboard-recent-transactions`
      );
      setRecentTransactions(response.data);
    } catch (error) {
      console.error("Error fetching deposits:", error);
    }
  };

  const getDashboardComparison = async () => {
    try {
      axios.get(`${urlApi}/g/dashboard/comparison/all`).then((response) => {
        if (response.status === 200) {
          setComparisonData(response.data);
        } else {
          throw new Error(
            "Error al obtener los datos: " + response.data.message
          );
        }
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    getMoneyTotal();
    getMoneyMonth();
    getExpenseMonth();
    getBudgetTotal();
    getRecentTransactions();
    getDashboardComparison();
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
        <Card>
          <CardHeader>
            <CardTitle>Descripción general del presupuesto</CardTitle>
            <CardDescription>
              Estado del presupuesto del mes actual
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {comparisonData.map((item, index) => (
                <div key={index}>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">
                        {item.TipoGasto}
                      </span>
                      {item.Presupuesto >= item.GastoActual ? (
                        <span className="text-sm text-green-600">
                          <span className="text-black">P: </span> $
                          {Intl.NumberFormat("es-CO").format(item.Presupuesto)}{" "}
                          / <span className="text-black">G.A: </span> $
                          {Intl.NumberFormat("es-CO").format(item.GastoActual)}
                        </span>
                      ) : (
                        <span className="text-sm text-red-600">
                          <span className="text-black">P: </span>$
                          {Intl.NumberFormat("es-CO").format(item.Presupuesto)}{" "}
                          / <span className="text-black">G.A: </span>$
                          {Intl.NumberFormat("es-CO").format(item.GastoActual)}
                        </span>
                      )}
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      {item.Presupuesto === 0 && item.GastoActual === 0 ? (
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: "0%" }}
                        ></div>
                      ) : item.Presupuesto >= item.GastoActual ? (
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{
                            width: `${Math.min(
                              (item.GastoActual / item.Presupuesto) * 100,
                              100
                            )}%`,
                          }}
                        ></div>
                      ) : (
                        <div
                          className="bg-red-500 h-2 rounded-full"
                          style={{
                            width: `${Math.min(
                              (item.GastoActual / item.Presupuesto) * 100,
                              100
                            )}%`,
                          }}
                        ></div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <br />
            <div className="flex w-full justify-around">
              <p>P = Presupuesto</p>
              <p>G.A = Gasto Actual </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
