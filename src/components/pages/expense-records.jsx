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
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, Save, Trash2, AlertTriangle } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

export default function ExpenseRecordsPage() {
  const [currentRecord, setCurrentRecord] = useState({
    date: new Date().toISOString().split("T")[0],
    monetaryFund: "",
    storeName: "",
    documentType: "",
    comments: "",
  });

  const [details, setDetails] = useState([]);
  const [records, setRecords] = useState([]);
  const [budgetAlert, setBudgetAlert] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [monetaryFunds, setMonetaryFunds] = useState([]);
  const [expenseTypes, setExpenseTypes] = useState([]);

  const documentTypes = ["Comprobante", "Factura", "Otro"];

  const fetchMonetaryFunds = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/server/v1/g/monetary-funds"
      );
      setMonetaryFunds(response.data);
    } catch (error) {
      console.error("Error loading monetary funds:", error);
    }
  };

  const fetchExpenseTypes = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/server/v1/g/expense-types"
      );
      setExpenseTypes(response.data);
    } catch (error) {
      console.error("Error loading expense types:", error);
    }
  };

  const fetchExpenseRecords = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:3000/server/v1/g/expense-records"
      );

      const recordsWithDetails = await Promise.all(
        response.data.map(async (record) => {
          try {
            const detailsResponse = await axios.get(
              "http://localhost:3000/server/v1/g/expense-records-details"
            );
            const recordDetails = detailsResponse.data.filter(
              (detail) => detail.GastoID === record.GastoID
            );
            return {
              ...record,
              details: recordDetails.map((detail) => ({
                id: detail.DetalleID,
                expenseTypeId: detail.TipoGastoID,
                expenseTypeName:
                  expenseTypes.find(
                    (type) => type.TipoGastoID === detail.TipoGastoID
                  )?.Nombre || "N/A",
                amount: detail.Monto,
              })),
            };
          } catch (error) {
            console.error(
              "Error loading details for record:",
              record.GastoID,
              error
            );
            return { ...record, details: [] };
          }
        })
      );

      setRecords(recordsWithDetails);
    } catch (error) {
      console.error("Error loading expense records:", error);
      setError("Error al cargar los registros de gastos");
    } finally {
      setLoading(false);
    }
  };

  const addDetail = () => {
    const newDetail = {
      id: Date.now(),
      expenseTypeId: "",
      amount: 0,
    };
    setDetails([...details, newDetail]);
  };

  const updateDetail = (id, field, value) => {
    setDetails(
      details.map((detail) =>
        detail.id === id ? { ...detail, [field]: value } : detail
      )
    );
  };

  const removeDetail = (id) => {
    setDetails(details.filter((detail) => detail.id !== id));
  };

  const getTotalAmount = () => {
    return details.reduce((sum, detail) => sum + (detail.amount || 0), 0);
  };

  const handleSave = async () => {
    if (!currentRecord.date || !currentRecord.monetaryFund) {
      setError("Fecha y Fondo Monetario son campos obligatorios");
      return;
    }

    if (details.length === 0) {
      setError("Debe agregar al menos un detalle de gasto");
      return;
    }

    const invalidDetails = details.filter(
      (detail) => !detail.expenseTypeId || detail.amount <= 0
    );

    if (invalidDetails.length > 0) {
      setError("Todos los detalles deben tener tipo de gasto y monto válido");
      return;
    }

    setError("");

    const headerData = {
      Fecha: currentRecord.date,
      FondoID: currentRecord.monetaryFund,
      Observaciones: currentRecord.comments || null,
      Comercio: currentRecord.storeName || null,
      TipoDocumento: currentRecord.documentType || null,
      UsuarioID: 1,
    };

    toast.promise(
      axios
        .post("http://localhost:3000/server/v1/i/expense-records", headerData)
        .then(async (response) => {
          if (response.status === 201) {
            const gastoID = response.data.gastoID;

            const detailPromises = details.map((detail) => {
              const detailData = {
                GastoID: gastoID,
                TipoGastoID: detail.expenseTypeId,
                Monto: detail.amount,
              };

              return toast.promise(
                axios
                  .post(
                    "http://localhost:3000/server/v1/i/expense-records-details",
                    detailData
                  )
                  .then((detailResponse) => {
                    if (detailResponse.status === 201) {
                      return "Detalle creado correctamente";
                    } else {
                      throw new Error(
                        "Error al crear detalle: " + detailResponse.data.message
                      );
                    }
                  }),
                {
                  loading: "Guardando detalle...",
                  success: (msg) => msg,
                  error: (err) => err.message || "Error al guardar detalle",
                }
              );
            });

            await Promise.all(detailPromises);

            setCurrentRecord({
              date: new Date().toISOString().split("T")[0],
              monetaryFund: "",
              storeName: "",
              documentType: "",
              comments: "",
            });
            setDetails([]);
            setBudgetAlert("");

            await fetchExpenseRecords();

            return "Registro de gastos guardado correctamente";
          } else {
            throw new Error(
              "Error al crear registro: " + response.data.message
            );
          }
        }),
      {
        loading: "Guardando registro de gastos...",
        success: (msg) => msg,
        error: (err) => {
          setError(err.message || "Error al guardar el registro de gastos");
          return err.message || "Error en la solicitud";
        },
      }
    );
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este tipo de gasto?"))
      return;

    toast.promise(
      axios
        .delete(`http://localhost:3000/server/v1/d/expense-records/${id}`)
        .then((response) => {
          if (response.status === 200) {
            fetchExpenseRecords();
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

  useEffect(() => {
    fetchExpenseRecords();
    fetchMonetaryFunds();
    fetchExpenseTypes();
  }, []);

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Nuevo registro de gastos</CardTitle>
          <CardDescription>
            Registre un nuevo gasto con información de encabezado y detalles
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Header Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Fecha *</Label>
              <Input
                id="date"
                type="date"
                value={currentRecord.date}
                onChange={(e) =>
                  setCurrentRecord((prev) => ({
                    ...prev,
                    date: e.target.value,
                  }))
                }
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="monetaryFund">Fondo Monetario *</Label>
              <Select
                value={currentRecord.monetaryFund}
                onValueChange={(value) =>
                  setCurrentRecord((prev) => ({ ...prev, monetaryFund: value }))
                }
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar fondo" />
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
              <Label htmlFor="storeName">Nombre de la tienda</Label>
              <Input
                id="storeName"
                value={currentRecord.storeName}
                onChange={(e) =>
                  setCurrentRecord((prev) => ({
                    ...prev,
                    storeName: e.target.value,
                  }))
                }
                placeholder="Introduzca el nombre de la tienda"
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="documentType">Tipo de documento</Label>
              <Select
                value={currentRecord.documentType}
                onValueChange={(value) =>
                  setCurrentRecord((prev) => ({ ...prev, documentType: value }))
                }
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar el tipo de documento" />
                </SelectTrigger>
                <SelectContent>
                  {documentTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="comments">Comentarios</Label>
              <Textarea
                id="comments"
                value={currentRecord.comments}
                onChange={(e) =>
                  setCurrentRecord((prev) => ({
                    ...prev,
                    comments: e.target.value,
                  }))
                }
                placeholder="Ingrese cualquier comentario adicional"
                rows={3}
                disabled={loading}
              />
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Detalles de gastos</h3>
              <Button onClick={addDetail} variant="outline" disabled={loading}>
                <Plus className="mr-2 h-4 w-4" />
                Agregar detalles
              </Button>
            </div>

            {details.length > 0 && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo de gasto</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead className="w-[100px]">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {details.map((detail) => (
                    <TableRow key={detail.id}>
                      <TableCell>
                        <Select
                          value={detail.expenseTypeId}
                          onValueChange={(value) =>
                            updateDetail(detail.id, "expenseTypeId", value)
                          }
                          disabled={loading}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione el tipo" />
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
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          step="0.01"
                          value={detail.amount || ""}
                          onChange={(e) =>
                            updateDetail(
                              detail.id,
                              "amount",
                              Number.parseFloat(e.target.value) || 0
                            )
                          }
                          placeholder="0"
                          disabled={loading}
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeDetail(detail.id)}
                          disabled={loading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell className="font-semibold">Total</TableCell>
                    <TableCell className="font-semibold font-mono">
                      ${Intl.NumberFormat("es-CO").format(getTotalAmount())}
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            )}
          </div>

          {budgetAlert && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{budgetAlert}</AlertDescription>
            </Alert>
          )}

          <Button onClick={handleSave} className="w-full" disabled={loading}>
            <Save className="mr-2 h-4 w-4" />
            Guardar registro de gastos
          </Button>
        </CardContent>
      </Card>

      {records.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Registros de gastos recientes</CardTitle>
            <CardDescription>
              Sus registros de gastos guardados recientemente
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading && <p>Cargando registros...</p>}
            <div className="space-y-4">
              {records.map((record) => (
                <div key={record.GastoID} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold">
                        {record.Comercio || "Expense Record"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(record.Fecha).toISOString().slice(0, 10)}•{" "}
                        {monetaryFunds.find(
                          (fund) =>
                            fund.FondoID.toString() ===
                            record.FondoID.toString()
                        )?.Nombre || record.FondoID}
                      </p>
                    </div>
                    <p className="font-mono font-semibold">
                      $
                      {record.details.reduce(
                        (sum, detail) => sum + detail.amount,
                        0
                      )}
                    </p>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(record.GastoID)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {record.Observaciones && (
                    <p className="text-sm text-muted-foreground mb-2">
                      {record.Observaciones}
                    </p>
                  )}
                  <div className="text-sm">
                    {record.details.map((detail, index) => (
                      <span key={detail.id}>
                        {detail.expenseTypeName}: $
                        {Intl.NumberFormat("es-CO").format(detail.amount)}
                        {index < record.details.length - 1 && " • "}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
