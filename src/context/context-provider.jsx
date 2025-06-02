import AppContext from "./app-context";
import PropTypes from "prop-types";

const AppProvider = ({ children }) => {
  AppProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };

  const urlApi = import.meta.env.VITE_API_URL;

  return (
    <AppContext.Provider
      value={{
        urlApi
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
