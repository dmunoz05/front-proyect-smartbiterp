import AppContext from "@context/app-context.jsx";
import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import {
  Calculator,
  BarChartIcon as ChartBar,
  DollarSign,
  FileText,
  FolderOpen,
  Home,
  PiggyBank,
  Receipt,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import ExpenseTypesPage from "./pages/expense-types";
import MonetaryFundsPage from "./pages/monetary-funds";
import BudgetPage from "./pages/budget";
import ExpenseRecordsPage from "./pages/expense-records";
import DepositRecordsPage from "./pages/deposit-records";
import MovementReportsPage from "./pages/movement-reports";
import BudgetComparisonPage from "./pages/budget-comparison";
import DashboardPage from "./pages/dashboard";
import logo from "@/assets/logo.png";

const navigationData = {
  maintenance: [
    {
      title: "Tipos de Gasto",
      url: "expense-types",
      icon: FolderOpen,
    },
    {
      title: "Fondo Monetario",
      url: "monetary-funds",
      icon: PiggyBank,
    },
  ],
  transactions: [
    {
      title: "Presupuesto por tipo de gasto",
      url: "budget",
      icon: Calculator,
    },
    {
      title: "Registros de gastos",
      url: "expense-records",
      icon: Receipt,
    },
    {
      title: "Depósitos",
      url: "deposit-records",
      icon: DollarSign,
    },
  ],
  reports: [
    {
      title: "Consulta de movimientos",
      url: "movement-reports",
      icon: FileText,
    },
    {
      title: "Gráfico Comparativo de Presupuesto y Ejecución",
      url: "budget-comparison",
      icon: ChartBar,
    },
  ],
};

export default function ExpenseTracker() {
  const navigate = useNavigate();
  const context = useContext(AppContext);
  const [activeView, setActiveView] = useState("dashboard");

  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return <DashboardPage />;
      case "expense-types":
        return <ExpenseTypesPage />;
      case "monetary-funds":
        return <MonetaryFundsPage />;
      case "budget":
        return <BudgetPage />;
      case "expense-records":
        return <ExpenseRecordsPage />;
      case "deposit-records":
        return <DepositRecordsPage />;
      case "movement-reports":
        return <MovementReportsPage />;
      case "budget-comparison":
        return <BudgetComparisonPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent"
              >
                <div className="flex aspect-square size-12 items-center justify-center rounded-lg bg-white border-2 boder-black">
                  <img
                    src={logo}
                    alt="Logo"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Moneta</span>
                  <span className="text-xs">Finanzas Personales</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => setActiveView("dashboard")}
                    isActive={activeView === "dashboard"}
                  >
                    <Home className="size-4" />
                    <span>Dashboard</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Mantenimientos</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigationData.maintenance.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      onClick={() => setActiveView(item.url)}
                      isActive={activeView === item.url}
                    >
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Movimientos</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigationData.transactions.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      onClick={() => setActiveView(item.url)}
                      isActive={activeView === item.url}
                    >
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Consultas y Reportes</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigationData.reports.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      onClick={() => setActiveView(item.url)}
                      isActive={activeView === item.url}
                    >
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-lg font-semibold">
            {activeView === "dashboard"
              ? "Dashboard"
              : activeView === "expense-types"
                ? "Tipos de gastos"
                : activeView === "monetary-funds"
                  ? "Fondo Monetario"
                  : activeView === "budget"
                    ? "Presupuesto por tipo de gasto"
                    : activeView === "expense-records"
                      ? "Registros de gastos"
                      : activeView === "deposit-records"
                        ? "Depósitos"
                        : activeView === "movement-reports"
                          ? "Consulta de movimientos"
                          : activeView === "budget-comparison"
                            ? "Gráfico Comparativo de Presupuesto y Ejecución"
                            : "Dashboard"}
          </h1>
          <button
            className="ml-auto rounded flex gap-2 bg-black px-2 py-1 hover:cursor-pointer text-white hover:bg-black/80"
            onClick={() => {
              context.LogOut();
            }}
          ><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-login"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M15 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" /><path d="M21 12h-13l3 -3" /><path d="M11 15l-3 -3" /></svg>
            <span>Salir</span>
          </button>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">{renderContent()}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
