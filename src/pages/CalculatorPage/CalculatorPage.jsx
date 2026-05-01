import React, { useState, useCallback } from "react";
import DatePicker from "react-datepicker";
import { format, differenceInMinutes } from "date-fns";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase";

import AnimeCard from "../../components/ui/AnimeCard/AnimeCard";
import AnimeInput from "../../components/ui/AnimeInput/AnimeInput";
import AnimeSelect from "../../components/ui/AnimeSelect/AnimeSelect";
import AnimeButton from "../../components/ui/AnimeButton/AnimeButton";
import ScoreDisplay from "../../components/ui/ScoreDisplay/ScoreDisplay";
import ThemeToggle from "../../components/ui/ThemeToggle/ThemeToggle";

import styles from "./CalculatorPage.module.css";

const STATUS_OPTIONS = [
  { value: "none", label: "None" },
  { value: "girlfriend", label: "Girlfriend" },
  { value: "spouse", label: "Spouse" },
];

const CalculatorPage = React.memo(function CalculatorPage() {
  const [score, setScore] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    tiktok: "",
    instagram: "",
    gmail: "",
    startTime: null,
    endTime: null,
    affectionLevel: "",
    specialStatus: "none",
    promptUsage: "",
  });

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSubmitted(false);
  }, []);

  const handleDateChange = useCallback((name, date) => {
    setFormData((prev) => ({ ...prev, [name]: date }));
    setSubmitted(false);
  }, []);

  const calculateTotal = useCallback(() => {
    const { affectionLevel, specialStatus, promptUsage, startTime, endTime } =
      formData;

    const affectionLevelNumber = parseInt(affectionLevel, 10) || 0;
    const promptUsageNumber = parseInt(promptUsage, 10) || 0;
    const timeDifference =
      startTime && endTime ? differenceInMinutes(endTime, startTime) : 0;
    const specialStatusIndex = ["none", "girlfriend", "spouse"].indexOf(
      specialStatus,
    );

    const total =
      affectionLevelNumber * 200 +
      specialStatusIndex * 10000 -
      promptUsageNumber * 25 -
      timeDifference * 50;

    return total;
  }, [formData]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setIsSubmitting(true);

      const formattedStartTime = formData.startTime
        ? format(formData.startTime, "dd/MM/yyyy HH:mm")
        : "";
      const formattedEndTime = formData.endTime
        ? format(formData.endTime, "dd/MM/yyyy HH:mm")
        : "";

      const total = calculateTotal();

      const userData = {
        ...formData,
        startTime: formattedStartTime,
        endTime: formattedEndTime,
        total,
      };

      try {
        await addDoc(collection(db, "user_data"), userData);
        setScore(total);
        setSubmitted(true);
      } catch (error) {
        console.error("Error saving document: ", error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, calculateTotal],
  );

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div className={styles.badge}>SCORE CALCULATOR</div>
        <ThemeToggle />
      </header>

      <AnimeCard className={styles.card}>
        <ScoreDisplay value={score} />

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.row}>
            <AnimeInput
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              autoComplete="name"
            />
          </div>

          <div className={styles.row}>
            <AnimeInput
              label="TikTok"
              name="tiktok"
              value={formData.tiktok}
              onChange={handleChange}
            />
          </div>

          <div className={styles.row}>
            <AnimeInput
              label="Instagram"
              name="instagram"
              value={formData.instagram}
              onChange={handleChange}
              autoComplete="username"
            />
          </div>

          <div className={styles.row}>
            <AnimeInput
              label="Gmail"
              name="gmail"
              type="email"
              value={formData.gmail}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </div>

          <div className={styles.row}>
            <label className={styles.dateLabel}>Start Time</label>
            <DatePicker
              selected={formData.startTime}
              onChange={(date) => handleDateChange("startTime", date)}
              showTimeSelect
              dateFormat="dd/MM/yyyy HH:mm"
              timeFormat="HH:mm"
              timeIntervals={1}
              placeholderText="Select start time"
              className={styles.dateInput}
              wrapperClassName={styles.dateWrapper}
              calendarClassName={styles.dateCalendar}
            />
          </div>

          <div className={styles.row}>
            <label className={styles.dateLabel}>End Time</label>
            <DatePicker
              selected={formData.endTime}
              onChange={(date) => handleDateChange("endTime", date)}
              showTimeSelect
              dateFormat="dd/MM/yyyy HH:mm"
              timeFormat="HH:mm"
              timeIntervals={1}
              placeholderText="Select end time"
              className={styles.dateInput}
              wrapperClassName={styles.dateWrapper}
              calendarClassName={styles.dateCalendar}
            />
          </div>

          <div className={styles.row}>
            <AnimeInput
              label="Affection Level"
              name="affectionLevel"
              type="number"
              value={formData.affectionLevel}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.row}>
            <AnimeSelect
              label="Special Status"
              name="specialStatus"
              value={formData.specialStatus}
              onChange={handleChange}
              options={STATUS_OPTIONS}
            />
          </div>

          <div className={styles.row}>
            <AnimeInput
              label="Chat Usage"
              name="promptUsage"
              type="number"
              value={formData.promptUsage}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.actions}>
            <AnimeButton type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Submitting..."
                : submitted
                  ? "Submitted ✨"
                  : "Calculate Score"}
            </AnimeButton>
          </div>
        </form>
      </AnimeCard>
    </main>
  );
});

export default CalculatorPage;
