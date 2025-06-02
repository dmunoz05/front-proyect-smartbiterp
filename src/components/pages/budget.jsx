import { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Save, Trash2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

export default function BudgetPage() {
  const [expenseTypes, setExpenseTypes] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [formData, setFormData] = useState({
    month: "",
    expenseTypeID: "",
    amount: "",
  });

  const months = [
    { value: "1", label: "Enero" },
    { value: "2", label: "Febrero" },
    { value: "3", label: "Marzo" },
    { value: "4", label: "Abril" },
    { value: "5", label: "Mayo" },
    { value: "6", label: "Junio" },
    { value: "7", label: "Julio" },
    { value: "8", label: "Agosto" },
    { value: "9", label: "Septiembre" },
    { value: "10", label: "Octubre" },
    { value: "11", label: "Noviembre" },
    { value: "12", label: "Diciembre" },
  ];

  const getMonthLabel = (month) => {
    const found = months.find((m) => parseInt(m.value) === month);
    return found ? found.label : month;
  };

  const fetchExpenseTypes = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/server/v1/g/expense-types"
      );
      setExpenseTypes(response.data);
    } catch (error) {
      console.error("Error fetching expense types:", error);
    }
  };

  const fetchBudgets = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/server/v1/g/budget"
      );
      setBudgets(response.data);
    } catch (error) {
      console.error("Error fetching budgets:", error);
    }
  };

  useEffect(() => {
    fetchExpenseTypes();
    fetchBudgets();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.promise(
      axios
        .post("http://localhost:3000/server/v1/i/budget", {
          Mes: parseInt(formData.month),
          TipoGastoID: parseInt(formData.expenseTypeID),
          Monto: parseFloat(formData.amount),
        })
        .then((response) => {
          if (response.status === 200) {
            setFormData({ month: "", expenseTypeID: "", amount: "" });
            fetchBudgets();
            return "Creado con éxito";
          } else {
            throw new Error("Error al crear: " + response.data.message);
          }
        }),
      {
        loading: "Creando presupuesto...",
        success: (msg) => msg,
        error: (err) => err.message || "Error en la solicitud",
      }
    );
  };

  const handleDelete = async (id) => {
    toast.promise(
      axios
        .delete(`http://localhost:3000/server/v1/d/budget/${id}`)
        .then((response) => {
          if (response.status === 200) {
            fetchBudgets();
            return "Se elimino con éxito";
          } else {
            throw new Error("Error al eliminar: " + response.data.message);
          }
        }),
      {
        loading: "Eliminando datos...",
        success: (msg) => msg,
        error: (err) => err.message || "Error en la solicitud",
      }
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Establecer presupuesto</CardTitle>
          <CardDescription>
            Definir presupuestos mensuales para cada tipo de gasto
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="month">Mes</Label>
                <Select
                  value={formData.month}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, month: value }))
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione mes" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month) => (
                      <SelectItem key={month.value} value={month.value}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expenseType">Tipo de gasto</Label>
                <Select
                  value={formData.expenseTypeID}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, expenseTypeID: value }))
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione el tipo de gasto" />
                  </SelectTrigger>
                  <SelectContent>
                    {expenseTypes.map((type) => (
                      <SelectItem
                        key={type.TipoGastoID}
                        value={type.TipoGastoID.toString()}
                      >
                        {type.Nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Monto presupuestado</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      amount: e.target.value,
                    }))
                  }
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              Ahorrar presupuesto
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Presupuestos actuales</CardTitle>
          <CardDescription>
            Vista general de presupuestos establecidos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mes</TableHead>
                <TableHead>Tipo de gasto</TableHead>
                <TableHead className="text-right">Monto</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {budgets.map((budget) => (
                <TableRow key={budget.PresupuestoID}>
                  <TableCell>{getMonthLabel(budget.Mes)}</TableCell>
                  <TableCell>{budget.Nombre}</TableCell>
                  <TableCell className="text-right font-mono">
                    ${budget.Monto.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(budget.PresupuestoID)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
