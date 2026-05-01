import React from "react";
import styles from "./AnimeButton.module.css";

const AnimeButton = React.memo(function AnimeButton({
  children,
  type = "button",
  onClick,
  disabled = false,
  className = "",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${styles.btn} ${className}`.trim()}
    >
      <span className={styles.text}>{children}</span>
      <span className={styles.shine} aria-hidden="true" />
    </button>
  );
});

export default AnimeButton;
