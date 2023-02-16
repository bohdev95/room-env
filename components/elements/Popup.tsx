import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import styles from "../../styles/components/Popup.module.css";

const Popup = ({ message }) => {
  const [off, setOff] = useState(false);
  useEffect(() => {
    const timeOn = setTimeout(() => {
      setOff(true);
      clearTimeout(timeOn);
    }, 2000);
  });
  return !off ? (
    <div className={styles.container}>
      <div className={styles.bar}>
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
      </div>
      <div className={styles.messagebox}>{message}</div>
    </div>
  ) : null;
};

export default Popup;
