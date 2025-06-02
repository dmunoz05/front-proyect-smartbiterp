import { Route, Routes } from "react-router-dom";
import Home from "@/components/expense-tracker.jsx";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  );
}
