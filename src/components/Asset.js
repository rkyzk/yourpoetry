import React from "react";
import { Spinner } from "react-bootstrap";
import styles from "../styles/Asset.module.css";

/**
 * Return Spinner.
 */
const Asset = () => {
  return (
    <div className={`${styles.Asset} p-4`}>
      <Spinner animation="border" />
    </div>
  );
};

export default Asset;
