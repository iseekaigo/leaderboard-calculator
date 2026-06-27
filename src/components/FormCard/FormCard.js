import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, differenceInMinutes } from "date-fns";
import {
  User,
  Video,
  Camera,
  Mail,
  Heart,
  Award,
  Sliders,
  Calendar,
  Sparkles,
  Loader2,
  CheckCircle,
  HelpCircle,
} from "lucide-react";

const FormCard = ({ onSubmit, db }) => {
  const [formData, setFormData] = useState({
    name: "",
    tiktok: "",
    instagram: "",
    gmail: "",
    startTime: null,
    endTime: null,
    affectionLevel: "5", // default to middle value
    specialStatus: "none",
    promptUsage: "0",
  });

  const [score, setScore] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Recalculate score in real-time as user changes inputs
  useEffect(() => {
    const affectionLevelNumber = parseInt(formData.affectionLevel, 10) || 0;
    const promptUsageNumber = parseInt(formData.promptUsage, 10) || 0;
    const timeDifference =
      formData.startTime && formData.endTime
        ? differenceInMinutes(formData.endTime, formData.startTime)
        : 0;
    const specialStatusIndex = ["none", "girlfriend", "spouse"].indexOf(
      formData.specialStatus,
    );

    const calculatedScore =
      affectionLevelNumber * 200 +
      specialStatusIndex * 10000 -
      promptUsageNumber * 25 -
      timeDifference * 50;

    setScore(calculatedScore);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDateChange = (name, date) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: date,
    }));
  };

  const handleSubmitInternal = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitSuccess(false);

    try {
      // Call the passed onSubmit handler
      await onSubmit(formData, score);
      setSubmitSuccess(true);

      // Auto reset success alert after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (error) {
      console.error("Submission failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Determine Anime Tier based on score
  const getTierInfo = (currentScore) => {
    if (currentScore >= 10000) {
      return {
        tier: "S-TIER",
        title: "Soulmates",
        japanese: "運命の二人",
        color: "var(--accent-primary)",
        glow: "rgba(255, 94, 140, 0.4)",
        desc: "An unbreakable red thread of fate binds your souls together.",
      };
    } else if (currentScore >= 2000) {
      return {
        tier: "A-TIER",
        title: "Deep Bond",
        japanese: "固い絆",
        color: "#bd93f9", // Neon Purple
        glow: "rgba(189, 147, 249, 0.4)",
        desc: "A powerful emotional connection that shines brightly.",
      };
    } else if (currentScore >= 0) {
      return {
        tier: "B-TIER",
        title: "Close Alliance",
        japanese: "仲良し",
        color: "var(--accent-secondary)",
        glow: "rgba(0, 240, 255, 0.4)",
        desc: "A friendly and harmonious relationship building day by day.",
      };
    } else {
      return {
        tier: "C-TIER",
        title: "Acquaintance",
        japanese: "知り合い",
        color: "var(--text-muted)",
        glow: "rgba(140, 143, 161, 0.2)",
        desc: "A distant connection. More coordinates and alignment are needed.",
      };
    }
  };

  const tier = getTierInfo(score);

  return (
    <div
      className="container"
      style={{ paddingBottom: "80px", marginTop: "40px" }}
    >
      <div className="grid-2" style={{ alignItems: "stretch", gap: "32px" }}>
        {/* LEFT COLUMN: THE FORM */}
        <div
          className="glass-card fade-in-up"
          style={{
            padding: "32px",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            animationDelay: "0.2s",
          }}
        >
          <div>
            <span className="japanese-sub">データの入力</span>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: 800,
                marginBottom: "8px",
              }}
            >
              Input Bond Parameters
            </h2>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              Provide accurate values to generate your Kizuna verification
              profile.
            </p>
          </div>

          <form
            onSubmit={handleSubmitInternal}
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            {/* SECTION 1: PERSONAL COORDINATES */}
            <div
              style={{
                borderBottom: "1px solid var(--border-color)",
                paddingBottom: "20px",
              }}
            >
              <h3
                style={{
                  fontSize: "0.9rem",
                  color: "var(--accent-primary)",
                  marginBottom: "16px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                1. Personal Coordinates
              </h3>

              <div className="grid-2" style={{ gap: "16px" }}>
                <div className="form-group">
                  <label className="form-label">
                    <User size={14} /> Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Enter full name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <Mail size={14} /> Gmail
                  </label>
                  <input
                    type="email"
                    name="gmail"
                    value={formData.gmail}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="name@gmail.com"
                    required
                  />
                </div>
              </div>

              <div
                className="grid-2"
                style={{ gap: "16px", marginTop: "12px" }}
              >
                <div className="form-group">
                  <label className="form-label">
                    <Video size={14} /> TikTok Handle
                  </label>
                  <input
                    type="text"
                    name="tiktok"
                    value={formData.tiktok}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="@username"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <Camera size={14} /> Instagram Handle
                  </label>
                  <input
                    type="text"
                    name="instagram"
                    value={formData.instagram}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="@username"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 2: CONNECTION METRICS */}
            <div>
              <h3
                style={{
                  fontSize: "0.9rem",
                  color: "var(--accent-secondary)",
                  marginBottom: "16px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                2. Connection Metrics
              </h3>

              <div className="grid-2" style={{ gap: "16px" }}>
                <div className="form-group">
                  <label className="form-label">
                    <Calendar size={14} /> Start Time
                  </label>
                  <DatePicker
                    selected={formData.startTime}
                    onChange={(date) => handleDateChange("startTime", date)}
                    showTimeSelect
                    dateFormat="dd/MM/yyyy HH:mm"
                    timeFormat="HH:mm"
                    timeIntervals={1}
                    placeholderText="Select start coordinate"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <Calendar size={14} /> End Time
                  </label>
                  <DatePicker
                    selected={formData.endTime}
                    onChange={(date) => handleDateChange("endTime", date)}
                    showTimeSelect
                    dateFormat="dd/MM/yyyy HH:mm"
                    timeFormat="HH:mm"
                    timeIntervals={1}
                    placeholderText="Select end coordinate"
                    required
                    minDate={formData.startTime}
                  />
                </div>
              </div>

              <div
                className="grid-2"
                style={{ gap: "16px", marginTop: "12px" }}
              >
                <div className="form-group">
                  <label className="form-label">
                    <Heart size={14} /> Affection Level (
                    {formData.affectionLevel})
                  </label>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--text-muted)",
                      }}
                    >
                      1
                    </span>
                    <input
                      type="range"
                      name="affectionLevel"
                      min="1"
                      max="10"
                      value={formData.affectionLevel}
                      onChange={handleChange}
                      style={{
                        flex: 1,
                        accentColor: "var(--accent-primary)",
                        cursor: "pointer",
                        height: "6px",
                        borderRadius: "var(--radius-full)",
                        background: "var(--border-color)",
                        border: "none",
                        outline: "none",
                      }}
                    />
                    <span
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--text-muted)",
                      }}
                    >
                      10
                    </span>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <Award size={14} /> Special Status
                  </label>
                  <select
                    name="specialStatus"
                    value={formData.specialStatus}
                    onChange={handleChange}
                    className="form-input"
                    style={{ cursor: "pointer" }}
                  >
                    <option value="none">None (Standard Friend)</option>
                    <option value="girlfriend">Girlfriend (+10,000 pts)</option>
                    <option value="spouse">Spouse (+20,000 pts)</option>
                  </select>
                </div>
              </div>

              <div className="form-group" style={{ marginTop: "12px" }}>
                <label className="form-label">
                  <Sliders size={14} /> Chat Usage / Prompt Penalty (
                  {formData.promptUsage})
                </label>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  <span
                    style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}
                  >
                    0
                  </span>
                  <input
                    type="range"
                    name="promptUsage"
                    min="0"
                    max="100"
                    step="5"
                    value={formData.promptUsage}
                    onChange={handleChange}
                    style={{
                      flex: 1,
                      accentColor: "var(--accent-secondary)",
                      cursor: "pointer",
                      height: "6px",
                      borderRadius: "var(--radius-full)",
                      background: "var(--border-color)",
                      border: "none",
                      outline: "none",
                    }}
                  />
                  <span
                    style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}
                  >
                    100
                  </span>
                </div>
                <span
                  style={{
                    fontSize: "0.7rem",
                    color: "var(--text-muted)",
                    marginTop: "6px",
                  }}
                >
                  Every prompt or chatbot helper used deducts 25 points from
                  your Kizuna score.
                </span>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
              style={{
                marginTop: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                height: "50px",
              }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>TRANSMITTING DATA...</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>CALCULATE & SUBMIT BOND</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: INTERACTIVE VISUAL DASHBOARD */}
        <div
          className="glass-card fade-in-up"
          style={{
            padding: "32px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            animationDelay: "0.4s",
            background:
              "linear-gradient(180deg, var(--bg-glass) 0%, rgba(var(--bg-secondary), 0.3) 100%)",
            border: `2px solid ${tier.color}`,
            boxShadow: `0 16px 40px rgba(0,0,0,0.1), 0 0 25px ${tier.glow}`,
          }}
        >
          {/* Header */}
          <div style={{ textAlign: "center" }}>
            <span className="japanese-sub" style={{ color: tier.color }}>
              {tier.japanese}
            </span>
            <h2
              style={{
                fontSize: "1.3rem",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              Kizuna Verification Hub
            </h2>
            <div
              style={{
                width: "60px",
                height: "2px",
                backgroundColor: tier.color,
                margin: "12px auto",
                boxShadow: `0 0 10px ${tier.color}`,
              }}
            />
          </div>

          {/* Large Live Score Display */}
          <div style={{ textAlign: "center", margin: "24px 0" }}>
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "var(--text-secondary)",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                display: "block",
                marginBottom: "4px",
              }}
            >
              LIVE BOND SCORE
            </span>
            <div
              style={{
                fontSize: "clamp(3rem, 6vw, 4.5rem)",
                fontWeight: 950,
                lineHeight: "1",
                fontFamily: "var(--font-mono)",
                color: tier.color,
                textShadow: `0 0 20px ${tier.glow}`,
                transition: "color var(--transition-normal)",
              }}
            >
              {score.toLocaleString()}
            </div>
          </div>

          {/* Anime Tier Badge */}
          <div
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              border: `1px solid ${tier.color}`,
              borderRadius: "var(--radius-md)",
              padding: "20px",
              textAlign: "center",
              marginBottom: "24px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Background watermarked text */}
            <div
              style={{
                position: "absolute",
                right: "-10px",
                bottom: "-20px",
                fontSize: "5rem",
                fontWeight: 900,
                color: "rgba(255, 255, 255, 0.02)",
                fontFamily: "var(--font-mono)",
                pointerEvents: "none",
                userSelect: "none",
              }}
            >
              {tier.tier}
            </div>

            <div
              style={{
                display: "inline-block",
                background: tier.color,
                color: "#ffffff",
                fontSize: "1rem",
                fontWeight: 900,
                padding: "4px 16px",
                borderRadius: "var(--radius-full)",
                letterSpacing: "0.1em",
                boxShadow: `0 4px 12px ${tier.glow}`,
                marginBottom: "8px",
              }}
            >
              {tier.tier} : {tier.title}
            </div>
            <p
              style={{
                fontSize: "0.85rem",
                color: "var(--text-secondary)",
                maxWidth: "320px",
                margin: "0 auto",
              }}
            >
              {tier.desc}
            </p>
          </div>

          {/* Score breakdown metrics */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              background: "rgba(0, 0, 0, 0.15)",
              borderRadius: "var(--radius-sm)",
              padding: "16px",
              fontSize: "0.8rem",
              fontFamily: "var(--font-mono)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                paddingBottom: "6px",
              }}
            >
              <span style={{ color: "var(--text-secondary)" }}>
                Affection Multiplier:
              </span>
              <span style={{ color: "var(--accent-success)" }}>
                +{parseInt(formData.affectionLevel, 10) * 200} pts
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                paddingBottom: "6px",
              }}
            >
              <span style={{ color: "var(--text-secondary)" }}>
                Special Status Bonus:
              </span>
              <span style={{ color: "var(--accent-success)" }}>
                +
                {formData.specialStatus === "spouse"
                  ? "20,000"
                  : formData.specialStatus === "girlfriend"
                    ? "10,000"
                    : "0"}{" "}
                pts
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                paddingBottom: "6px",
              }}
            >
              <span style={{ color: "var(--text-secondary)" }}>
                Chat Prompt Penalty:
              </span>
              <span style={{ color: "var(--accent-primary)" }}>
                -{parseInt(formData.promptUsage, 10) * 25} pts
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                paddingBottom: "2px",
              }}
            >
              <span style={{ color: "var(--text-secondary)" }}>
                Temporal Difference Penalty:
              </span>
              <span style={{ color: "var(--accent-primary)" }}>
                -
                {formData.startTime && formData.endTime
                  ? differenceInMinutes(formData.endTime, formData.startTime) *
                    50
                  : 0}{" "}
                pts
              </span>
            </div>
          </div>

          {/* Form Submission Status Alert */}
          {submitSuccess && (
            <div
              className="fade-in-up"
              style={{
                marginTop: "20px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                background: "rgba(16, 185, 129, 0.12)",
                border: "1px solid var(--accent-success)",
                borderRadius: "var(--radius-sm)",
                padding: "12px 16px",
                color: "var(--accent-success)",
                fontSize: "0.85rem",
                fontWeight: 600,
              }}
            >
              <CheckCircle size={18} />
              <div>
                <span style={{ display: "block", fontWeight: 700 }}>
                  BOND TRANSMITTED SUCCESSFULLY!
                </span>
                <span style={{ fontWeight: 500, opacity: 0.9 }}>
                  Profile locked into the secure Kizuna matrix.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Embedded styles for keyframe spinning and standard overrides */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        
        /* Make React DatePicker responsive and align with inputs */
        .react-datepicker-popper {
          z-index: 1000 !important;
        }
        .react-datepicker {
          background-color: var(--bg-secondary) !important;
          border: 1px solid var(--border-color) !important;
          border-radius: var(--radius-md) !important;
          color: var(--text-primary) !important;
          font-family: var(--font-sans) !important;
          box-shadow: var(--shadow-lg) !important;
        }
        .react-datepicker__header {
          background-color: var(--bg-primary) !important;
          border-bottom: 1px solid var(--border-color) !important;
        }
        .react-datepicker__current-month,
        .react-datepicker__day-name,
        .react-datepicker__day,
        .react-datepicker__time-name,
        .react-datepicker-time__header {
          color: var(--text-primary) !important;
        }
        .react-datepicker__day:hover,
        .react-datepicker__time-list-item:hover {
          background-color: var(--accent-primary) !important;
          color: white !important;
        }
        .react-datepicker__day--selected,
        .react-datepicker__time-list-item--selected {
          background-color: var(--accent-primary) !important;
          color: white !important;
        }
        .react-datepicker__time-container {
          border-left: 1px solid var(--border-color) !important;
          background-color: var(--bg-secondary) !important;
        }
        .react-datepicker__time {
          background-color: var(--bg-secondary) !important;
        }
        .react-datepicker__time-list-item {
          color: var(--text-primary) !important;
        }
      `}</style>
    </div>
  );
};

export default FormCard;
