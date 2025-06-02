import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"

export default function MovementReportsPage() {
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  })

  // Mock data combining deposits and expenses
  const [movements] = useState([
    {
      id: "1",
      date: "2024-01-15",
      type: "deposit",
      description: "Salary Deposit",
      monetaryFund: "Main Checking Account",
      amount: 3500.0,
    },
    {
      id: "2",
      date: "2024-01-14",
      type: "expense",
      description: "Grocery Store",
      monetaryFund: "Main Checking Account",
      amount: 85.32,
      expenseType: "Food & Dining",
    },
    {
      id: "3",
      date: "2024-01-13",
      type: "expense",
      description: "Gas Station",
      monetaryFund: "Main Checking Account",
      amount: 45.0,
      expenseType: "Transportation",
    },
    {
      id: "4",
      date: "2024-01-12",
      type: "deposit",
      description: "Freelance Payment",
      monetaryFund: "Savings Account",
      amount: 800.0,
    },
    {
      id: "5",
      date: "2024-01-11",
      type: "expense",
      description: "Movie Theater",
      monetaryFund: "Cash Wallet",
      amount: 25.0,
      expenseType: "Entertainment",
    },
    {
      id: "6",
      date: "2024-01-10",
      type: "expense",
      description: "Electric Bill",
      monetaryFund: "Main Checking Account",
      amount: 120.5,
      expenseType: "Utilities",
    },
  ])

  const filteredMovements = movements.filter((movement) => {
    if (!dateRange.startDate && !dateRange.endDate) return true

    const movementDate = new Date(movement.date)
    const start = dateRange.startDate ? new Date(dateRange.startDate) : null
    const end = dateRange.endDate ? new Date(dateRange.endDate) : null

    if (start && movementDate < start) return false
    if (end && movementDate > end) return false

    return true
  })

  const getTotalDeposits = () => {
    return filteredMovements.filter((m) => m.type === "deposit").reduce((sum, m) => sum + m.amount, 0)
  }

  const getTotalExpenses = () => {
    return filteredMovements.filter((m) => m.type === "expense").reduce((sum, m) => sum + m.amount, 0)
  }

  const getNetMovement = () => {
    return getTotalDeposits() - getTotalExpenses()
  }

  const getTypeColor = (type) => {
    return type === "deposit" ? "text-green-600" : "text-red-600"
  }

  const getTypeBadge = (type) => {
    return type === "deposit" ? "default" : "destructive"
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Movement Reports</CardTitle>
          <CardDescription>View all deposits and expenses within a date range</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange((prev) => ({ ...prev, startDate: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange((prev) => ({ ...prev, endDate: e.target.value }))}
              />
            </div>
            <div className="flex items-end">
              <Button>
                <Search className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Total Deposits</p>
                  <p className="text-2xl font-bold text-green-600">+${getTotalDeposits().toFixed(2)}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Total Expenses</p>
                  <p className="text-2xl font-bold text-red-600">-${getTotalExpenses().toFixed(2)}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Net Movement</p>
                  <p className={`text-2xl font-bold ${getNetMovement() >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {getNetMovement() >= 0 ? "+" : ""}${getNetMovement().toFixed(2)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Fund</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMovements.map((movement) => (
                <TableRow key={movement.id}>
                  <TableCell>{new Date(movement.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant={getTypeBadge(movement.type)}>
                      {movement.type.charAt(0).toUpperCase() + movement.type.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{movement.description}</TableCell>
                  <TableCell>{movement.monetaryFund}</TableCell>
                  <TableCell>{movement.expenseType || "-"}</TableCell>
                  <TableCell className={`text-right font-mono ${getTypeColor(movement.type)}`}>
                    {movement.type === "deposit" ? "+" : "-"}${movement.amount.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
