import Alert from "react-bootstrap/Alert";
import { useAlert } from "../contexts/AlertContext";
import { useEffect } from "react";
import styles from "../styles/AlertComponent.module.css";

/**
 * Return Alert component
 */
const AlertComponent = () => {
  const { alert, show, hideAlert } = useAlert();
  useEffect(() => {
    // hide alert after 5 sec
    const removeAlert = setTimeout(() => {
      hideAlert();
    }, 5000);
    return () => {
      clearTimeout(removeAlert);
    };
  }, [show, hideAlert]);
  if (show) {
    return (
      <div className="d-flex justify-content-center">
        <Alert className={styles.AlertMessage} variant={"info"}>
          {alert}
        </Alert>
      </div>
    );
  } else {
    return null;
  }
};

export default AlertComponent;
