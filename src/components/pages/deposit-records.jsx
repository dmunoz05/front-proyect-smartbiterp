import { useState, useEffect, useContext } from "react";
import AppContext from "@/context/app-context";
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

export default function DepositRecordsPage() {
  const context = useContext(AppContext);
  const urlApi = context.urlApi;
  const [formData, setFormData] = useState({
    date: "",
    monetaryFund: "",
    amount: "",
  });
  const [monetaryFunds, setMonetaryFunds] = useState([]);
  const [deposits, setDeposits] = useState([]);

  const getMonetaryFunds = async () => {
    try {
      const response = await axios.get(`${urlApi}/g/monetary-funds`);
      setMonetaryFunds(response.data);
    } catch (error) {
      console.error("Error fetching monetary funds:", error);
    }
  };

  const getDeposits = async () => {
    try {
      const response = await axios.get(`${urlApi}/g/deposit-records`);
      setDeposits(response.data);
    } catch (error) {
      console.error("Error fetching deposits:", error);
    }
  };

  useEffect(() => {
    getMonetaryFunds();
    getDeposits();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newDeposit = {
        Fecha: formData.date,
        FondoID: formData.monetaryFund,
        Monto: parseFloat(formData.amount),
        UsuarioID: context.user.id,
      };
      toast.promise(
        axios
          .post(`${urlApi}/i/deposit-records`, newDeposit)
          .then((response) => {
            if (response.status === 201) {
              getDeposits();
              setFormData({ date: "", monetaryFund: "", amount: "" });
              return "Creado con éxito";
            } else {
              throw new Error("Error al crear: " + response.data.message);
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

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este tipo de gasto?"))
      return;

    toast.promise(
      axios.delete(`${urlApi}/d/deposit-records/${id}`).then((response) => {
        if (response.status === 200) {
          getDeposits();
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

  const getTotalDeposits = () => {
    return deposits.reduce((total, dep) => total + parseFloat(dep.Monto), 0);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Nuevo Depósito</CardTitle>
          <CardDescription>
            Registra un nuevo depósito a tus fondos monetarios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Fecha</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, date: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="monetaryFund">Fondo Monetario</Label>
                <Select
                  value={formData.monetaryFund}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, monetaryFund: value }))
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un fondo" />
                  </SelectTrigger>
                  <SelectContent>
                    {monetaryFunds.map((fund) => (
                      <SelectItem
                        key={fund.FondoID}
                        value={fund.FondoID.toString()}
                      >
                        {fund.Nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Monto</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, amount: e.target.value }))
                  }
                  placeholder="0"
                  required
                />
              </div>
            </div>
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              Guardar Depósito
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Historial de Depósitos</CardTitle>
              <CardDescription>
                Lista de todos los depósitos realizados
              </CardDescription>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total depositado</p>
              <p className="text-2xl font-bold font-mono text-green-600">
                ${Intl.NumberFormat("es-CO").format(getTotalDeposits())}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Fondo Monetario</TableHead>
                <TableHead className="text-right">Monto</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deposits.map((deposit) => (
                <TableRow key={deposit.DepositoID}>
                  <TableCell>
                    {new Date(deposit.Fecha + "T00:00:00")
                      .toISOString()
                      .slice(0, 10)}
                  </TableCell>
                  <TableCell>
                    {monetaryFunds.find((f) => f.FondoID === deposit.FondoID)
                      ?.Nombre || `Fondo ${deposit.Nombre}`}
                  </TableCell>
                  <TableCell className="text-right font-mono text-green-600">
                    +$
                    {Intl.NumberFormat("es-CO").format(
                      parseFloat(deposit.Monto)
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(deposit.DepositoID)}
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
