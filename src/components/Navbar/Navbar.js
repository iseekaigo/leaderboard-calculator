import React from "react";
import { Sun, Moon, Heart, Sparkles } from "lucide-react";

const Navbar = ({ theme, toggleTheme }) => {
  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "var(--bg-glass)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border-color)",
        transition:
          "background var(--transition-normal), border var(--transition-normal)",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "70px",
        }}
      >
        {/* Brand / Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              background:
                "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
              width: "36px",
              height: "36px",
              borderRadius: "var(--radius-sm)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              boxShadow: "var(--shadow-glow)",
            }}
          >
            <Heart size={18} fill="#ffffff" />
          </div>
          <div>
            <span
              className="japanese-sub"
              style={{ marginBottom: "0px", lineHeight: "1" }}
            >
              絆・メトリクス
            </span>
            <span
              className="anime-title"
              style={{
                fontSize: "1.1rem",
                fontWeight: 800,
                letterSpacing: "0.1em",
                color: "var(--text-primary)",
              }}
            >
              KIZUNA CALC
            </span>
          </div>
        </div>

        {/* Right side items */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          {/* Decorative stats */}
          <div
            className="desktop-only"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: "rgba(255, 94, 140, 0.08)",
              border: "1px solid var(--border-glow)",
              borderRadius: "var(--radius-full)",
              padding: "4px 12px",
              fontSize: "0.75rem",
              fontWeight: 600,
              color: "var(--accent-primary)",
            }}
          >
            <Sparkles size={12} />
            <span>METRICS ENGINE V1.2</span>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            style={{
              background: "none",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-sm)",
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text-primary)",
              cursor: "pointer",
              transition: "all var(--transition-fast)",
            }}
            title={
              theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"
            }
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--accent-primary)";
              e.currentTarget.style.color = "var(--accent-primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border-color)";
              e.currentTarget.style.color = "var(--text-primary)";
            }}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>

      {/* CSS style injected for desktop-only media query */}
      <style>{`
        @media (max-width: 767px) {
          .desktop-only {
            display: none !important;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
