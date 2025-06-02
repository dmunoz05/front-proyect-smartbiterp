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

export default function ExpenseRecordsPage() {
  const [records, setRecords] = useState([]);
  const [currentRecord, setCurrentRecord] = useState({
    date: "",
    monetaryFund: "",
    comments: "",
    storeName: "",
    documentType: "",
  });
  const [details, setDetails] = useState([]);
  const [budgetAlert, setBudgetAlert] = useState(null);

  const monetaryFunds = [
    "Main Checking Account",
    "Savings Account",
    "Cash Wallet",
  ];
  const documentTypes = ["Receipt", "Invoice", "Other"];
  const expenseTypes = [
    "Food & Dining",
    "Transportation",
    "Entertainment",
    "Utilities",
    "Healthcare",
  ];

  // Mock budget data
  const budgets = {
    "Food & Dining": 500,
    Transportation: 300,
    Entertainment: 200,
    Utilities: 400,
    Healthcare: 250,
  };

  const addDetail = () => {
    const newDetail = {
      id: Date.now().toString(),
      expenseType: "",
      amount: 0,
    };
    setDetails((prev) => [...prev, newDetail]);
  };

  const updateDetail = (id, field, value) => {
    setDetails((prev) =>
      prev.map((detail) =>
        detail.id === id ? { ...detail, [field]: value } : detail
      )
    );
  };

  const removeDetail = (id) => {
    setDetails((prev) => prev.filter((detail) => detail.id !== id));
  };

  const checkBudget = () => {
    const expensesByType = {};

    details.forEach((detail) => {
      if (detail.expenseType && detail.amount > 0) {
        expensesByType[detail.expenseType] =
          (expensesByType[detail.expenseType] || 0) + detail.amount;
      }
    });

    const overBudgetTypes = [];
    Object.entries(expensesByType).forEach(([type, amount]) => {
      const budget = budgets[type];
      if (budget && amount > budget) {
        overBudgetTypes.push(
          `${type}: $${amount.toFixed(2)} exceeds budget of $${budget.toFixed(
            2
          )}`
        );
      }
    });

    if (overBudgetTypes.length > 0) {
      setBudgetAlert(`Budget exceeded for: ${overBudgetTypes.join(", ")}`);
      return false;
    }

    setBudgetAlert(null);
    return true;
  };

  const handleSave = () => {
    if (
      !currentRecord.date ||
      !currentRecord.monetaryFund ||
      details.length === 0
    ) {
      alert(
        "Please fill in all required fields and add at least one expense detail."
      );
      return;
    }

    checkBudget();

    const newRecord = {
      id: Date.now().toString(),
      ...currentRecord,
      details: [...details],
    };

    setRecords((prev) => [...prev, newRecord]);
    setCurrentRecord({
      date: "",
      monetaryFund: "",
      comments: "",
      storeName: "",
      documentType: "",
    });
    setDetails([]);
  };

  const getTotalAmount = () => {
    return details.reduce((sum, detail) => sum + (detail.amount || 0), 0);
  };

  return (
    <div className="space-y-6">
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
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="monetaryFund">Fondo Monetario *</Label>
              <Select
                value={currentRecord.monetaryFund}
                onValueChange={(value) =>
                  setCurrentRecord((prev) => ({ ...prev, monetaryFund: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar fondo" />
                </SelectTrigger>
                <SelectContent>
                  {monetaryFunds.map((fund) => (
                    <SelectItem key={fund} value={fund}>
                      {fund}
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
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="documentType">Tipo de documento</Label>
              <Select
                value={currentRecord.documentType}
                onValueChange={(value) =>
                  setCurrentRecord((prev) => ({ ...prev, documentType: value }))
                }
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
              />
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Detalles de gastos</h3>
              <Button onClick={addDetail} variant="outline">
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
                          value={detail.expenseType}
                          onValueChange={(value) =>
                            updateDetail(detail.id, "expenseType", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione el tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            {expenseTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
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
                          placeholder="0.00"
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeDetail(detail.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell className="font-semibold">Total</TableCell>
                    <TableCell className="font-semibold font-mono">
                      ${getTotalAmount().toFixed(2)}
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

          <Button onClick={handleSave} className="w-full">
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
            <div className="space-y-4">
              {records.map((record) => (
                <div key={record.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold">
                        {record.storeName || "Expense Record"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {record.date} • {record.monetaryFund}
                      </p>
                    </div>
                    <p className="font-mono font-semibold">
                      $
                      {record.details
                        .reduce((sum, detail) => sum + detail.amount, 0)
                        .toFixed(2)}
                    </p>
                  </div>
                  {record.comments && (
                    <p className="text-sm text-muted-foreground mb-2">
                      {record.comments}
                    </p>
                  )}
                  <div className="text-sm">
                    {record.details.map((detail, index) => (
                      <span key={detail.id}>
                        {detail.expenseType}: ${detail.amount.toFixed(2)}
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
