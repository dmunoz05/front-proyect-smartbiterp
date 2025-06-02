import { useEffect, useState, useContext } from "react";
import AppContext from "@context/app-context";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Plus, Trash2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

export default function ExpenseTypesPage() {
  const context = useContext(AppContext);
  const urlApi = context.urlApi;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingType, setEditingType] = useState(null);
  const [formData, setFormData] = useState({ name: "" });
  const [section, setSection] = useState([]);

  // Obtener datos
  const getExpenseTypes = async () => {
    try {
      const response = await axios.get(
        `${urlApi}/g/expense-types`
      );
      setSection(response.data);
    } catch (error) {
      console.error("Error fetching expense types:", error);
    }
  };

  useEffect(() => {
    getExpenseTypes();
  }, []);

  const openAddDialog = () => {
    setEditingType(null);
    setFormData({ name: "" });
    setIsDialogOpen(true);
  };

  const handleEdit = (type) => {
    setEditingType(type);
    setFormData({ name: type.Nombre });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingType) {
        toast.promise(
          axios
            .put(
              `${urlApi}/u/expense-types/${editingType.TipoGastoID}`,
              { Nombre: formData.name, Descripcion: "" }
            )
            .then((response) => {
              if (response.status === 200) {
                setIsDialogOpen(false);
                getExpenseTypes();
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
            .post(`${urlApi}/i/expense-types`, {
              Nombre: formData.name,
              Descripcion: "",
            })
            .then((response) => {
              if (response.status === 201) {
                setIsDialogOpen(false);
                getExpenseTypes();
                return "Creado con éxito";
              } else {
                throw new Error("Error al crear: " + response.data.message);
              }
            }),
          {
            loading: "Creando tipo de gasto...",
            success: (msg) => msg,
            error: (err) => err.message || "Error en la solicitud",
          }
        );
      }
    } catch (error) {
      console.error("Error guardado expense-type:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este tipo de gasto?"))
      return;

    toast.promise(
      axios
        .delete(`${urlApi}/d/expense-types/${id}`)
        .then((response) => {
          if (response.status === 200) {
            getExpenseTypes();
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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Tipos de gastos</CardTitle>
            <CardDescription>
              Gestiona tus categorías y tipos de gastos
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAddDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Agregar nuevo tipo de gasto
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>
                    {editingType
                      ? "Editar tipo de gasto"
                      : "Agregar nuevo tipo de gasto"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingType
                      ? "Actualice la información del tipo de gasto."
                      : "Crear una nueva categoría de tipo de gasto."}
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
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="col-span-3"
                      placeholder="Ingrese el nombre del tipo de gasto"
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">
                    {editingType ? "Actualizar" : "Crear"}
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
              <TableHead>Código</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {section.map((type) => (
              <TableRow key={type.TipoGastoID}>
                <TableCell className="font-mono">{type.Codigo}</TableCell>
                <TableCell>{type.Nombre}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(type)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(type.TipoGastoID)}
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
