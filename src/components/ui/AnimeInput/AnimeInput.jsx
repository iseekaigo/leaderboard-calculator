import React, { useId } from "react";
import styles from "./AnimeInput.module.css";

const AnimeInput = React.memo(function AnimeInput({
  label,
  name,
  value = "",
  onChange,
  type = "text",
  required = false,
  autoComplete,
  placeholder,
}) {
  const id = useId();
  const hasValue = value && String(value).length > 0;

  return (
    <div className={styles.field}>
      <input
        id={id}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder || " "}
        className={styles.input}
        aria-label={label}
      />
      <label
        htmlFor={id}
        className={`${styles.label} ${hasValue ? styles.filled : ""}`}
      >
        {label}
      </label>
      <span className={styles.underline} aria-hidden="true" />
    </div>
  );
});

export default AnimeInput;
