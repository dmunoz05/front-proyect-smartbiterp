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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Badge } from "@/components/ui/badge";
import { Edit, Plus, Trash2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

export default function MonetaryFundsPage() {
  const context = useContext(AppContext);
  const urlApi = context.urlApi;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFund, setEditingFund] = useState(null);
  const [formData, setFormData] = useState({ name: "", type: "" });
  const [funds, setFunds] = useState([]);

  const getFunds = async () => {
    try {
      const response = await axios.get(
        `${urlApi}/g/monetary-funds`
      );
      setFunds(response.data);
    } catch (error) {
      console.error("Error fetching funds:", error);
    }
  };

  useEffect(() => {
    getFunds();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingFund) {
        toast.promise(
          axios
            .put(
              `${urlApi}/u/monetary-funds/${editingFund.FondoID}`,
              {
                Nombre: formData.name,
                Tipo: formData.type,
              }
            )
            .then((response) => {
              if (response.status === 200) {
                getFunds();
                setIsDialogOpen(false);
                setEditingFund(null);
                setFormData({ name: "", type: "" });
                return "Se actualizo con éxito";
              } else {
                throw new Error(
                  "Error al actualizar: " + response.data.message
                );
              }
            }),
          {
            loading: "Actualizando cambios...",
            success: (msg) => msg,
            error: (err) => err.message || "Error en la solicitud",
          }
        );
      } else {
        toast.promise(
          axios
            .post(`${urlApi}/i/monetary-funds`, {
              Nombre: formData.name,
              Tipo: formData.type,
            })
            .then((response) => {
              if (response.status === 201) {
                getFunds();
                setIsDialogOpen(false);
                setEditingFund(null);
                setFormData({ name: "", type: "" });
                return "Creado con éxito";
              } else {
                throw new Error("Error al crear: " + response.data.message);
              }
            }),
          {
            loading: "Creando fondo monetario...",
            success: (msg) => msg,
            error: (err) => err.message || "Error en la solicitud",
          }
        );
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleEdit = (fund) => {
    setEditingFund(fund);
    setFormData({ name: fund.Nombre, type: fund.Tipo });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    toast.promise(
      axios
        .delete(`${urlApi}/d/monetary-funds/${id}`)
        .then((response) => {
          if (response.status === 200) {
            getFunds();
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

  const openAddDialog = () => {
    setEditingFund(null);
    setFormData({ name: "", type: "" });
    setIsDialogOpen(true);
  };

  const getTypeLabel = (type) => {
    return type === "bank_account"
      ? "Cuenta bancaria"
      : "Dinero para gastos menores";
  };

  const getTypeBadgeVariant = (type) => {
    return type === "bank_account" ? "default" : "secondary";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Fondos Monetarios</CardTitle>
            <CardDescription>
              Administra tus cuentas bancarias y fondos de efectivo
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAddDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Agregar nuevo fondo
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>
                    {editingFund
                      ? "Editar Fondo Monetario"
                      : "Añadir nuevo Fondo Monetario"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingFund
                      ? "Actualizar la información del fondo."
                      : "Crear un nuevo fondo monetario."}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Nombre
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className="col-span-3"
                      placeholder="Introduzca el nombre del fondo"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="type" className="text-right">
                      Tipo
                    </Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, type: value }))
                      }
                      required
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Seleccione el tipo de fondo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bank_account">
                          Cuenta bancaria
                        </SelectItem>
                        <SelectItem value="petty_cash">
                          Dinero para gastos menores
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">
                    {editingFund ? "Actualizar" : "Crear"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre del fondo</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {funds.map((fund) => (
              <TableRow key={fund.FondoID}>
                <TableCell className="font-medium">{fund.Nombre}</TableCell>
                <TableCell>
                  <Badge variant={getTypeBadgeVariant(fund.Tipo)}>
                    {getTypeLabel(fund.Tipo)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(fund)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(fund.FondoID)}
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
  );
}
