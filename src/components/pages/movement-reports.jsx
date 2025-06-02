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
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import axios from "axios";

export default function MovementReportsPage() {
  const context = useContext(AppContext);
  const urlApi = context.urlApi;

  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });
  const [tempRange, setTempRange] = useState({ startDate: "", endDate: "" });

  const [movements, setMovements] = useState([]);

  const getMovementReports = async () => {
    try {
      const params = {};

      if (dateRange.startDate)
        params.startDate = { startDate: dateRange.startDate };
      if (dateRange.endDate) params.endDate = { startDate: dateRange.endDate };

      const response = await axios.get(`${urlApi}/g/movement-reports`, {
        params,
      });
      setMovements(response.data);
    } catch (error) {
      console.error("Error fetching movement reports:", error);
    }
  };

  const filteredMovements = movements.filter((movement) => {
    if (!dateRange.startDate && !dateRange.endDate) return true;

    const movementDate = new Date(movement.date);
    const start = dateRange.startDate ? new Date(dateRange.startDate) : null;
    const end = dateRange.endDate ? new Date(dateRange.endDate) : null;

    if (start && movementDate < start) return false;
    if (end && movementDate > end) return false;

    return true;
  });

  const getTotalDeposits = () => {
    return filteredMovements
      .filter((m) => m.type === "deposit")
      .reduce((sum, m) => sum + m.amount, 0);
  };

  const getTotalExpenses = () => {
    return filteredMovements
      .filter((m) => m.type === "expense")
      .reduce((sum, m) => sum + m.amount, 0);
  };

  const getNetMovement = () => {
    return getTotalDeposits() - getTotalExpenses();
  };

  const getTypeColor = (type) => {
    return type === "deposit" ? "text-green-600" : "text-red-600";
  };

  const getTypeBadge = (type) => {
    return type === "deposit" ? "default" : "destructive";
  };

  useEffect(() => {
    getMovementReports();
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informes de movimiento</CardTitle>
          <CardDescription>
            Ver todos los depósitos y gastos dentro de un rango de fechas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="startDate">Fecha de inicio</Label>
              <Input
                id="startDate"
                type="date"
                value={tempRange.startDate}
                onChange={(e) =>
                  setTempRange({ ...tempRange, startDate: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Fecha de finalización</Label>
              <Input
                id="endDate"
                type="date"
                value={tempRange.endDate}
                onChange={(e) =>
                  setTempRange({ ...tempRange, endDate: e.target.value })
                }
              />
            </div>
            <div className="flex items-end">
              <Button onClick={() => setDateRange(tempRange)}>
                <Search className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Depósitos totales
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    +${Intl.NumberFormat("es-CO").format(getTotalDeposits())}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Gastos totales
                  </p>
                  <p className="text-2xl font-bold text-red-600">
                    -${Intl.NumberFormat("es-CO").format(getTotalExpenses())}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Movimiento de red
                  </p>
                  <p
                    className={`text-2xl font-bold ${
                      getNetMovement() >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {getNetMovement() >= 0 ? "+" : "-"}$
                    {Intl.NumberFormat("es-CO").format(getNetMovement())}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Financiar</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead className="text-right">Cantidad</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMovements.map((movement, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {new Date(movement.date + "T00:00:00")
                      .toISOString()
                      .slice(0, 10)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getTypeBadge(movement.type)}>
                      {movement.type.charAt(0).toUpperCase() +
                        movement.type.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {movement.description}
                  </TableCell>
                  <TableCell>{movement.monetaryFund}</TableCell>
                  <TableCell>{movement.expenseType || "-"}</TableCell>
                  <TableCell
                    className={`text-right font-mono ${getTypeColor(
                      movement.type
                    )}`}
                  >
                    {movement.type === "deposit" ? "+" : "-"}$
                    {Intl.NumberFormat("es-CO").format(movement.amount)}
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
