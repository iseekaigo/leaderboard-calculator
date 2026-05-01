import React from "react";
import { useAnimatedNumber } from "../../../hooks/useAnimatedNumber";
import styles from "./ScoreDisplay.module.css";

const ScoreDisplay = React.memo(function ScoreDisplay({ value }) {
  const display = useAnimatedNumber(value ?? 0, 900);

  return (
    <div className={styles.wrapper} aria-live="polite" aria-atomic="true">
      <span className={styles.label}>Your Score</span>
      <span className={styles.number}>{display.toLocaleString()}</span>
    </div>
  );
});

export default ScoreDisplay;
