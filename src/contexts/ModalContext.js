import { createContext, useContext, useState } from "react";

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

/**
 * Modal context for displaying error messages.
 */
export const ModalProvider = ({ children }) => {
  const [obj, setObj] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [objId, setObjId] = useState(0);

  const showConfModal = (obj, id) => {
    setObj(obj);
    setObjId(id);
    setShowModal(true);
  };

  const hideModal = () => {
    setObj("");
    setShowModal(false);
    setObjId(0);
  };

  return (
    <ModalContext.Provider
      value={{ obj, showModal, objId, showConfModal, hideModal }}
    >
      {children}
    </ModalContext.Provider>
  );
};
