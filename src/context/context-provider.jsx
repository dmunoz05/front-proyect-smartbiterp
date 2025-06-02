import AppContext from "./app-context";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";

const AppProvider = ({ children }) => {
  AppProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };

  const urlApi = import.meta.env.VITE_API_URL;
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  function LogOut() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    navigate("/login");
    toast.success("Sesión cerrada correctamente.");
  }

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("authToken");
      if (!token && !isAuthenticated && document.location.pathname == "/" && document.location.hash != "#/welcome" && document.location.hash != "#/login"){
        navigate("/welcome");
      }
      if (!token && !isAuthenticated && document.location.hash != "#/welcome" && document.location.hash != "#/login") {
        setIsAuthenticated(false);
        localStorage.removeItem("authToken");
        toast.error("Por favor, inicia sesión para continuar.");
        navigate("/login");
        return;
      }
      if (token) {
        try {
          const res = await axios.get(`${urlApi}/auth/validate-token`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (res.status === 200) {
            setIsAuthenticated(true);
            const objUser = { id: res.data.user.usuarioID, username: res.data.user.username}
            setUser(objUser);
          } else {
            throw new Error("Token inválido");
          }
        } catch (err) {
          console.error("Error validando sesión:", err.message);
          localStorage.removeItem("authToken");
          localStorage.removeItem("user");
          setIsAuthenticated(false);
          navigate("/login");
        }
      }
    };

    checkAuth();
  }, [urlApi, navigate]);

  return (
    <AppContext.Provider
      value={{
        urlApi,
        isAuthenticated,
        setIsAuthenticated,
        LogOut,
        user,
        setUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
