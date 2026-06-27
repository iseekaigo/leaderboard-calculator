import React from "react";
import { Sparkles, Heart, Clock, MessageSquare } from "lucide-react";

const Hero = () => {
  return (
    <div
      className="fade-in-up"
      style={{
        paddingTop: "60px",
        paddingBottom: "40px",
        textAlign: "center",
      }}
    >
      <div className="container" style={{ maxWidth: "800px" }}>
        {/* Japanese Subtitle */}
        <span
          className="japanese-sub"
          style={{
            fontSize: "0.85rem",
            letterSpacing: "0.3em",
            marginBottom: "8px",
          }}
        >
          運命の赤い糸 ・ 絆スコア計算機
        </span>

        {/* Main Heading */}
        <h1
          className="anime-title"
          style={{
            fontSize: "clamp(2rem, 5vw, 3.2rem)",
            fontWeight: 900,
            lineHeight: 1.15,
            marginBottom: "20px",
            background:
              "linear-gradient(135deg, var(--text-primary) 30%, var(--accent-primary))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "-0.01em",
          }}
        >
          Evaluate Your Bond Metrics
        </h1>

        {/* Description Paragraph */}
        <p
          style={{
            fontSize: "clamp(0.95rem, 2vw, 1.1rem)",
            color: "var(--text-secondary)",
            maxWidth: "640px",
            margin: "0 auto 40px auto",
            lineHeight: "1.7",
          }}
        >
          Welcome to{" "}
          <strong style={{ color: "var(--accent-primary)" }}>
            Kizuna Calc
          </strong>
          , an advanced cinematic evaluation system inspired by modern anime
          aesthetics. Map your affection parameters, temporal differences, and
          communication density to calculate your ultimate compatibility score.
        </p>

        {/* Feature Highlights Grid */}
        <div
          className="grid-3"
          style={{
            marginTop: "20px",
            textAlign: "left",
          }}
        >
          {/* Card 1 */}
          <div
            className="glass-card"
            style={{
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              borderRadius: "var(--radius-md)",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "var(--radius-sm)",
                background: "rgba(255, 94, 140, 0.1)",
                color: "var(--accent-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Heart size={18} fill="currentColor" />
            </div>
            <div>
              <h3
                style={{
                  fontSize: "1rem",
                  fontWeight: 700,
                  marginBottom: "4px",
                }}
              >
                Affection Mapping
              </h3>
              <p
                style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}
              >
                Quantify emotional resonance and status levels with precise
                weighted algorithms.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div
            className="glass-card"
            style={{
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              borderRadius: "var(--radius-md)",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "var(--radius-sm)",
                background: "rgba(59, 130, 246, 0.1)",
                color: "var(--accent-secondary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Clock size={18} />
            </div>
            <div>
              <h3
                style={{
                  fontSize: "1rem",
                  fontWeight: 700,
                  marginBottom: "4px",
                }}
              >
                Temporal Alignment
              </h3>
              <p
                style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}
              >
                Measure duration parameters. Efficiency in connection yields
                higher scores.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div
            className="glass-card"
            style={{
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              borderRadius: "var(--radius-md)",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "var(--radius-sm)",
                background: "rgba(16, 185, 129, 0.1)",
                color: "var(--accent-success)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MessageSquare size={18} />
            </div>
            <div>
              <h3
                style={{
                  fontSize: "1rem",
                  fontWeight: 700,
                  marginBottom: "4px",
                }}
              >
                Chat Efficiency
              </h3>
              <p
                style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}
              >
                Factor in prompt usage. Direct, meaningful connection optimizes
                the Kizuna level.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
