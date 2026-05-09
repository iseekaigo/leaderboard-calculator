import React, { useEffect, useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, differenceInMinutes } from "date-fns";
import { addDoc, collection } from "firebase/firestore";
import { db } from "./firebase";
import "./App.css";

const STORAGE_KEY = "akari-ui-theme";

const specialStatusOptions = [
  { value: "none", label: "No bond", note: "Base score only" },
  { value: "girlfriend", label: "Girlfriend arc", note: "+10,000 points" },
  { value: "spouse", label: "Spouse ending", note: "+20,000 points" },
];

const fieldGroups = [
  {
    title: "Identity signal",
    description: "Core profile details for each event calculation.",
    fields: [
      {
        label: "Display name",
        name: "name",
        type: "text",
        placeholder: "Hoshino Akari",
      },
      {
        label: "TikTok handle",
        name: "tiktok",
        type: "text",
        placeholder: "@akari.edits",
      },
      {
        label: "Instagram handle",
        name: "instagram",
        type: "text",
        placeholder: "@akari.frames",
      },
      {
        label: "Gmail address",
        name: "gmail",
        type: "email",
        placeholder: "akari.scene@gmail.com",
      },
    ],
  },
  {
    title: "Session metrics",
    description: "Inputs that determine pacing, intensity, and score impact.",
    fields: [
      {
        label: "Affection level",
        name: "affectionLevel",
        type: "number",
        placeholder: "0",
        min: 0,
      },
      {
        label: "Prompt usage",
        name: "promptUsage",
        type: "number",
        placeholder: "0",
        min: 0,
      },
    ],
  },
];

const initialFormData = {
  name: "",
  tiktok: "",
  instagram: "",
  gmail: "",
  startTime: null,
  endTime: null,
  affectionLevel: "",
  specialStatus: "none",
  promptUsage: "",
};

const getPreferredTheme = () => {
  if (typeof window === "undefined") {
    return "dark";
  }

  const savedTheme = window.localStorage.getItem(STORAGE_KEY);
  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const FireworksCanvas = ({ theme }) => {
  useEffect(() => {
    const canvas = document.getElementById("fireworks-canvas");
    if (!canvas) {
      return undefined;
    }

    const context = canvas.getContext("2d", { alpha: true });
    if (!context) {
      return undefined;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const isLowPowerDevice =
      navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;

    if (prefersReducedMotion.matches || isLowPowerDevice) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      return undefined;
    }

    let animationFrameId = 0;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let stars = [];
    let sparks = [];
    let lastBurst = 0;

    const palette =
      theme === "dark"
        ? ["#f7c3ff", "#9ad7ff", "#ffd28f", "#a3ffe0"]
        : ["#7257ff", "#f06292", "#2bb8a5", "#ff9f45"];

    const setCanvasSize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      stars = Array.from(
        { length: Math.max(24, Math.floor(width / 55)) },
        () => ({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 1.8 + 0.4,
          alpha: Math.random() * 0.45 + 0.15,
        }),
      );
    };

    const launchBurst = () => {
      const burstX = Math.random() * width;
      const burstY = Math.random() * (height * 0.45) + 40;
      const particles = 18 + Math.floor(Math.random() * 14);

      for (let index = 0; index < particles; index += 1) {
        const angle = (Math.PI * 2 * index) / particles;
        const velocity = Math.random() * 2.8 + 0.8;
        sparks.push({
          x: burstX,
          y: burstY,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity,
          alpha: 1,
          life: Math.random() * 40 + 36,
          color: palette[index % palette.length],
          size: Math.random() * 2.2 + 1,
        });
      }
    };

    const draw = (timestamp) => {
      context.clearRect(0, 0, width, height);

      stars.forEach((star) => {
        context.beginPath();
        context.fillStyle =
          theme === "dark"
            ? `rgba(255,255,255,${star.alpha})`
            : `rgba(74,62,128,${star.alpha * 0.6})`;
        context.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        context.fill();
      });

      if (timestamp - lastBurst > 1300) {
        launchBurst();
        lastBurst = timestamp;
      }

      sparks = sparks.filter((spark) => spark.alpha > 0.03 && spark.life > 0);
      sparks.forEach((spark) => {
        spark.x += spark.vx;
        spark.y += spark.vy;
        spark.vy += 0.028;
        spark.alpha *= 0.975;
        spark.life -= 1;

        context.beginPath();
        context.fillStyle = `${spark.color}${Math.round(
          Math.max(spark.alpha, 0) * 255,
        )
          .toString(16)
          .padStart(2, "0")}`;
        context.arc(spark.x, spark.y, spark.size, 0, Math.PI * 2);
        context.fill();
      });

      animationFrameId = window.requestAnimationFrame(draw);
    };

    setCanvasSize();
    animationFrameId = window.requestAnimationFrame(draw);
    window.addEventListener("resize", setCanvasSize);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", setCanvasSize);
    };
  }, [theme]);

  return (
    <canvas
      id="fireworks-canvas"
      className="fireworks-canvas"
      aria-hidden="true"
    />
  );
};

const Navbar = ({ theme, onToggleTheme }) => (
  <header className="navbar shell">
    <div className="brand-mark">
      <span className="brand-mark__icon">灯</span>
      <div>
        <p className="eyebrow">anime event system</p>
        <h1>Akari Scoreboard</h1>
      </div>
    </div>

    <div className="navbar__actions">
      <button type="button" className="ghost-button">
        Live benchmark
      </button>
      <button
        type="button"
        className="theme-toggle"
        onClick={onToggleTheme}
        aria-label="Toggle color theme"
      >
        <span>{theme === "dark" ? "☾" : "☼"}</span>
        <span>{theme === "dark" ? "Dark mode" : "Light mode"}</span>
      </button>
    </div>
  </header>
);

const Hero = ({ score, sessionDuration, specialStatusLabel }) => (
  <section className="hero shell">
    <div className="hero__content panel">
      <p className="eyebrow">cinematic anime-inspired analytics</p>
      <h2>
        A polished event calculator with a subtle festival-night atmosphere and
        production-ready UX.
      </h2>
      <p className="hero__lede">
        This interface reframes the original calculator into a responsive
        control room: strong hierarchy, accessible contrast, reusable tokens,
        and a background motion system that stays lightweight on mid-tier
        devices.
      </p>

      <div className="hero__stats">
        <article className="stat-card">
          <span>Current total</span>
          <strong>{score}</strong>
          <small>Realtime from active inputs</small>
        </article>
        <article className="stat-card">
          <span>Session duration</span>
          <strong>{sessionDuration} min</strong>
          <small>Auto-calculated from timestamps</small>
        </article>
        <article className="stat-card">
          <span>Relationship state</span>
          <strong>{specialStatusLabel}</strong>
          <small>Weighted by bond multiplier</small>
        </article>
      </div>
    </div>

    <aside className="hero__visual panel panel--highlight">
      <div className="scene-glow" />
      <p className="eyebrow">design system notes</p>
      <ul className="feature-list">
        <li>Dual-theme palette with atmospheric gradients</li>
        <li>Reusable cards, form controls, chips, and stat modules</li>
        <li>Glassmorphism restrained for readability, not gimmicks</li>
        <li>Canvas fireworks disabled for reduced-motion and weaker CPUs</li>
      </ul>
      <div className="quote-card">
        <span>夜空のように静かで、花火のように印象的。</span>
        <p>Quiet like a night sky, memorable like a fireworks cutscene.</p>
      </div>
    </aside>
  </section>
);

const InsightCards = ({
  total,
  affectionLevel,
  promptUsage,
  sessionDuration,
}) => {
  const cards = [
    {
      title: "Affection gain",
      value: affectionLevel * 200,
      description: "Emotional momentum translated into the core score stream.",
    },
    {
      title: "Prompt penalty",
      value: promptUsage * 25,
      description: "Cost pressure from additional prompt usage during the run.",
    },
    {
      title: "Time penalty",
      value: sessionDuration * 50,
      description: "Longer sessions decrease total efficiency in the formula.",
    },
    {
      title: "Projected total",
      value: total,
      description:
        "Net result after modifiers, duration, and status weighting.",
    },
  ];

  return (
    <section className="insights shell">
      {cards.map((card) => (
        <article className="insight-card panel" key={card.title}>
          <p>{card.title}</p>
          <strong>{card.value}</strong>
          <span>{card.description}</span>
        </article>
      ))}
    </section>
  );
};

const FormCard = ({
  formData,
  onChange,
  onDateChange,
  onSubmit,
  total,
  status,
  isSubmitting,
}) => (
  <section className="form-section shell">
    <div className="panel form-panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">event inputs</p>
          <h3>Session composer</h3>
        </div>
        <div className="score-pill">
          <span>Live total</span>
          <strong>{total}</strong>
        </div>
      </div>

      <form className="score-form" onSubmit={onSubmit}>
        {fieldGroups.map((group) => (
          <section className="form-group" key={group.title}>
            <div className="form-group__header">
              <h4>{group.title}</h4>
              <p>{group.description}</p>
            </div>
            <div className="form-grid">
              {group.fields.map((field) => (
                <label className="field" key={field.name}>
                  <span>{field.label}</span>
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={onChange}
                    placeholder={field.placeholder}
                    min={field.min}
                  />
                </label>
              ))}
            </div>
          </section>
        ))}

        <section className="form-group">
          <div className="form-group__header">
            <h4>Timeline and status</h4>
            <p>Timestamp controls and emotional state multipliers.</p>
          </div>
          <div className="form-grid form-grid--timeline">
            <label className="field">
              <span>Start time</span>
              <DatePicker
                selected={formData.startTime}
                onChange={(date) => onDateChange("startTime", date)}
                showTimeSelect
                dateFormat="dd/MM/yyyy HH:mm"
                timeFormat="HH:mm"
                timeIntervals={5}
                placeholderText="Select start scene"
                className="date-input"
              />
            </label>
            <label className="field">
              <span>End time</span>
              <DatePicker
                selected={formData.endTime}
                onChange={(date) => onDateChange("endTime", date)}
                showTimeSelect
                dateFormat="dd/MM/yyyy HH:mm"
                timeFormat="HH:mm"
                timeIntervals={5}
                placeholderText="Select ending scene"
                className="date-input"
              />
            </label>
            <label className="field field--full">
              <span>Special status</span>
              <div className="status-chips">
                {specialStatusOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`status-chip ${
                      formData.specialStatus === option.value ? "is-active" : ""
                    }`}
                    onClick={() =>
                      onChange({
                        target: { name: "specialStatus", value: option.value },
                      })
                    }
                  >
                    <strong>{option.label}</strong>
                    <span>{option.note}</span>
                  </button>
                ))}
              </div>
            </label>
          </div>
        </section>

        <div className="form-footer">
          <div className={`submit-status ${status.type}`}>
            <strong>{status.title}</strong>
            <span>{status.message}</span>
          </div>
          <button
            type="submit"
            className="primary-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving scene..." : "Save event score"}
          </button>
        </div>
      </form>
    </div>
  </section>
);

const App = () => {
  const [theme, setTheme] = useState(getPreferredTheme);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({
    type: "idle",
    title: "Ready",
    message: "Fill the inputs to generate a live score and save the event.",
  });
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleSystemTheme = (event) => {
      const savedTheme = window.localStorage.getItem(STORAGE_KEY);
      if (!savedTheme) {
        setTheme(event.matches ? "dark" : "light");
      }
    };

    mediaQuery.addEventListener("change", handleSystemTheme);
    return () => mediaQuery.removeEventListener("change", handleSystemTheme);
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleDateChange = (name, date) => {
    setFormData((current) => ({
      ...current,
      [name]: date,
    }));
  };

  const calculatedValues = useMemo(() => {
    const affectionLevel = Number.parseInt(formData.affectionLevel, 10) || 0;
    const promptUsage = Number.parseInt(formData.promptUsage, 10) || 0;
    const specialStatusIndex = specialStatusOptions.findIndex(
      (option) => option.value === formData.specialStatus,
    );
    const sessionDuration =
      formData.startTime && formData.endTime
        ? Math.max(differenceInMinutes(formData.endTime, formData.startTime), 0)
        : 0;

    const total =
      affectionLevel * 200 +
      Math.max(specialStatusIndex, 0) * 10000 -
      promptUsage * 25 -
      sessionDuration * 50;

    return {
      affectionLevel,
      promptUsage,
      specialStatusIndex,
      sessionDuration,
      total,
    };
  }, [formData]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({
      type: "idle",
      title: "Saving",
      message: "Persisting the current event scene to Firestore.",
    });

    const payload = {
      ...formData,
      startTime: formData.startTime
        ? format(formData.startTime, "dd/MM/yyyy HH:mm")
        : "",
      endTime: formData.endTime
        ? format(formData.endTime, "dd/MM/yyyy HH:mm")
        : "",
      total: calculatedValues.total,
    };

    try {
      await addDoc(collection(db, "user_data"), payload);
      setStatus({
        type: "success",
        title: "Saved successfully",
        message:
          "The event score was written to Firestore without blocking the UI.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        title: "Save failed",
        message:
          "Firestore rejected the request. Check environment variables and rules.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const specialStatusLabel =
    specialStatusOptions.find(
      (option) => option.value === formData.specialStatus,
    )?.label || "No bond";

  return (
    <div className="app-shell">
      <FireworksCanvas theme={theme} />
      <div className="background-gradient" aria-hidden="true" />
      <Navbar
        theme={theme}
        onToggleTheme={() =>
          setTheme((currentTheme) =>
            currentTheme === "dark" ? "light" : "dark",
          )
        }
      />
      <main>
        <Hero
          score={calculatedValues.total}
          sessionDuration={calculatedValues.sessionDuration}
          specialStatusLabel={specialStatusLabel}
        />
        <InsightCards
          total={calculatedValues.total}
          affectionLevel={calculatedValues.affectionLevel}
          promptUsage={calculatedValues.promptUsage}
          sessionDuration={calculatedValues.sessionDuration}
        />
        <FormCard
          formData={formData}
          onChange={handleChange}
          onDateChange={handleDateChange}
          onSubmit={handleSubmit}
          total={calculatedValues.total}
          status={status}
          isSubmitting={isSubmitting}
        />
      </main>
    </div>
  );
};

export default App;
