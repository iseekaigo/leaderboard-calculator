import React from "react";
import styles from "./AnimeCard.module.css";

const AnimeCard = React.memo(function AnimeCard({ children, className = "" }) {
  return <div className={`${styles.card} ${className}`.trim()}>{children}</div>;
});

export default AnimeCard;
