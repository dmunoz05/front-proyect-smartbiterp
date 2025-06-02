/* eslint-disable react/prop-types */
import AppContext from "@context/app-context";
import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import logo from '../assets/logo.png';
import { toast } from "sonner";
import axios from "axios";

export default function LoginScreen() {
  const context = useContext(AppContext);
  const urlApi = context.urlApi;
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin();
  };

  const handleLogin = async () => {
    toast.promise(
      axios
        .post(`${urlApi}/auth/login`, credentials)
        .then((res) => {
          if (res.status === 200 && res.data.token) {
            localStorage.setItem("authToken", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            context.setIsAuthenticated(true);
            context.setUser(res.data.usuario);
            navigate("/");
            return "Sesión iniciada correctamente";
          } else {
            throw new Error("Credenciales inválidas");
          }
        }),
      {
        loading: "Iniciando sesión...",
        success: (msg) => msg,
        error: (err) => err.message || "Error al iniciar sesión",
      }
    );
  };


  return (
    <>
      {/* Fondo visual con gradiente */}
      <div className="fixed inset-0 z-[-1] bg-neutral-700 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />

      {/* Contenedor del login centrado */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg z-10">
          <CardHeader className="space-y-4 text-center">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border-2 border-black">
              <img
                src={logo}
                alt="Moneta Logo"
                className="mb-4 h-24 w-24 rounded-full"
              />
            </div>
            <CardTitle className="text-2xl font-bold">Inicio de sesión</CardTitle>
            <CardDescription>
              Ingresa a tu cuenta de gestión de finanzas personales
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Usuario</Label>
                <Input
                  id="username"
                  placeholder="Enter your username"
                  value={credentials.username}
                  onChange={(e) =>
                    setCredentials({ ...credentials, username: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={credentials.password}
                  onChange={(e) =>
                    setCredentials({ ...credentials, password: e.target.value })
                  }
                  required
                />
              </div>
            </CardContent>

            <CardFooter className="flex-col space-y-4">
              <Button type="submit" className="w-full">
                Iniciar sesión
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </>
  );
}
