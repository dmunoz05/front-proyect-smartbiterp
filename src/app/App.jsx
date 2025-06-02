import AppRouter from "../routes/router/root.jsx";
import "./App.css";
import { Toaster } from "sonner";

export default function App() {
  return (
    <>
      <AppRouter />
      <Toaster richColors />
    </>
  );
}
