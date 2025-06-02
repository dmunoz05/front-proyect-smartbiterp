import Home from "@/components/expense-tracker.jsx";
import Welcome from "@/routes/welcome/welcome.jsx";
import { Route, Routes } from "react-router-dom";
import Login from "@/routes/login/login.jsx";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/welcome" element={<Welcome />} />
    </Routes>
  );
}
