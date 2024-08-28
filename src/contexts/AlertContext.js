import { createContext, useContext, useState } from "react";

const AlertContext = createContext();

export const useAlert = () => useContext(AlertContext);

/**
 * Alert context for displaying error messages.
 */
export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState("");
  const [show, setShow] = useState(false);

  const showAlert = (message) => {
    setAlert(message);
    setShow(true);
  };

  const hideAlert = () => {
    setAlert("");
    setShow(false);
  };

  return (
    <AlertContext.Provider value={{ alert, show, showAlert, hideAlert }}>
      {children}
    </AlertContext.Provider>
  );
};
