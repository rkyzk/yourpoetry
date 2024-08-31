import { createContext, useContext, useState } from "react";

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

/**
 * Modal context for displaying error messages.
 */
export const ModalProvider = ({ children }) => {
  const [showModal, setShowModal] = useState(false);
  const [objId, setObjId] = useState(0);

  const showConfModal = (id) => {
    setObjId(id);
    setShowModal(true);
  };

  const hideModal = () => {
    setShowModal(false);
    setObjId(0);
  };

  return (
    <ModalContext.Provider
      value={{ showModal, objId, showConfModal, hideModal }}
    >
      {children}
    </ModalContext.Provider>
  );
};
