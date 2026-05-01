import React, { useId } from "react";
import styles from "./AnimeSelect.module.css";

const AnimeSelect = React.memo(function AnimeSelect({
  label,
  name,
  value = "",
  onChange,
  options = [],
  required = false,
}) {
  const id = useId();
  const hasValue = value && String(value).length > 0;

  return (
    <div className={styles.field}>
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={styles.select}
        aria-label={label}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <label
        htmlFor={id}
        className={`${styles.label} ${hasValue ? styles.filled : ""}`}
      >
        {label}
      </label>
      <span className={styles.arrow} aria-hidden="true" />
    </div>
  );
});

export default AnimeSelect;
