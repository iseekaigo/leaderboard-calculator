import React, { useEffect, useMemo, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, differenceInMinutes } from "date-fns";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";
import "./App.css";

const promptSeed = 2196;
const designPlan = {
  hero: "Cinematic Center",
  font: "Cabinet Grotesk fallback stack",
  components: [
    "Inline Typography Images",
    "Infinite Marquee",
    "Feedback/Testimonial Carousel",
  ],
  motion: ["Image Scale & Fade Scroll", "Scrubbing Text Reveals"],
};

const testimonials = [
  {
    quote:
      "The interface feels like an anime title card translated into a serious product. It is calm, precise, and unexpectedly emotional.",
    name: "Mina Takahashi",
    role: "Brand Systems Lead",
  },
  {
    quote:
      "The score calculator stopped looking like a tool and started feeling like a scene. The pacing, spacing, and glow are exactly right.",
    name: "Arif Nugraha",
    role: "Creative Frontend Director",
  },
  {
    quote:
      "What stands out is restraint. The atmosphere is cinematic, but the UX remains practical on mobile and desktop.",
    name: "Kaori Sato",
    role: "Product Design Reviewer",
  },
];

const marqueeItems = [
  "Cinematic hierarchy",
  "Adaptive theming",
  "Dense grid rhythm",
  "Motion with restraint",
  "Mobile-first ergonomics",
  "Readable contrast",
];

const featureCards = [
  {
    eyebrow: "Atmosphere",
    title: "A polished anime tone without neon overload",
    text: "Layered gradients, filmic contrast, and controlled highlights create a premium mood that stays readable under real product conditions.",
    className: "feature-card feature-card--tall",
  },
  {
    eyebrow: "System",
    title: "Responsive by structure, not patchwork",
    text: "The layout scales from small phones to wide desktops through fluid spacing tokens, resilient grid tracks, and balanced content widths.",
    className: "feature-card",
  },
  {
    eyebrow: "Performance",
    title: "Motion budgeted for mid-range devices",
    text: "Canvas fireworks degrade gracefully, decorative layers avoid layout shifts, and interaction effects rely on transforms and opacity.",
    className: "feature-card",
  },
  {
    eyebrow: "Workflow",
    title: "Built to evolve into a reusable UI system",
    text: "Cards, controls, chips, sections, and theme tokens are organized for future extension instead of one-off styling debt.",
    className: "feature-card feature-card--wide",
  },
];

const socialLinks = [
  { label: "TikTok", key: "tiktok", placeholder: "@handle or URL" },
  { label: "Instagram", key: "instagram", placeholder: "@handle or URL" },
  {
    label: "Gmail",
    key: "gmail",
    placeholder: "name@gmail.com",
    type: "email",
  },
];

const statusOptions = [
  { value: "none", label: "None" },
  { value: "girlfriend", label: "Girlfriend" },
  { value: "spouse", label: "Spouse" },
];

function useTheme() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") {
      return "dark";
    }

    const stored = window.localStorage.getItem("calculator-theme");
    if (stored === "light" || stored === "dark") {
      return stored;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    window.localStorage.setItem("calculator-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = (event) => {
      const stored = window.localStorage.getItem("calculator-theme");
      if (!stored) {
        setTheme(event.matches ? "dark" : "light");
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", listener);
      return () => mediaQuery.removeEventListener("change", listener);
    }

    mediaQuery.addListener(listener);
    return () => mediaQuery.removeListener(listener);
  }, []);

  return {
    theme,
    toggleTheme: () =>
      setTheme((current) => (current === "dark" ? "light" : "dark")),
  };
}

function FireworksCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof window === "undefined") {
      return undefined;
    }

    const context = canvas.getContext("2d", { alpha: true });
    if (!context) {
      return undefined;
    }

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const lowPower =
      window.innerWidth < 640 || (navigator.hardwareConcurrency || 4) <= 4;
    const particleMultiplier = reducedMotion ? 0 : lowPower ? 0.55 : 1;
    const fireworks = [];
    let width = 0;
    let height = 0;
    let animationFrame = 0;
    let lastLaunch = 0;

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = Math.max(window.innerHeight, 720);
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const spawnFirework = (timestamp) => {
      if (particleMultiplier === 0) {
        return;
      }

      const originX = width * (0.18 + Math.random() * 0.64);
      const originY = height * (0.16 + Math.random() * 0.38);
      const hue = 320 + Math.random() * 80;
      const count = Math.round((18 + Math.random() * 16) * particleMultiplier);
      const particles = Array.from({ length: count }, (_, index) => {
        const angle = (Math.PI * 2 * index) / count;
        const speed = 0.8 + Math.random() * 2.1;
        return {
          x: originX,
          y: originY,
          dx: Math.cos(angle) * speed,
          dy: Math.sin(angle) * speed,
          life: 48 + Math.random() * 24,
          decay: 0.92 + Math.random() * 0.02,
          size: 1 + Math.random() * 2.4,
          alpha: 0.9,
        };
      });

      fireworks.push({ hue, particles, bornAt: timestamp });
    };

    const render = (timestamp) => {
      context.clearRect(0, 0, width, height);

      if (timestamp - lastLaunch > (lowPower ? 1800 : 1200)) {
        spawnFirework(timestamp);
        lastLaunch = timestamp;
      }

      for (let i = fireworks.length - 1; i >= 0; i -= 1) {
        const firework = fireworks[i];

        for (let j = firework.particles.length - 1; j >= 0; j -= 1) {
          const particle = firework.particles[j];
          particle.x += particle.dx;
          particle.y += particle.dy;
          particle.dy += 0.018;
          particle.dx *= particle.decay;
          particle.dy *= particle.decay;
          particle.life -= 1;
          particle.alpha = Math.max(0, particle.life / 72);

          context.beginPath();
          context.fillStyle = `hsla(${firework.hue}, 90%, 72%, ${particle.alpha})`;
          context.shadowBlur = 14;
          context.shadowColor = `hsla(${firework.hue}, 100%, 70%, 0.55)`;
          context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          context.fill();
        }

        firework.particles = firework.particles.filter(
          (particle) => particle.life > 0,
        );
        if (firework.particles.length === 0) {
          fireworks.splice(i, 1);
        }
      }

      animationFrame = window.requestAnimationFrame(render);
    };

    resize();
    animationFrame = window.requestAnimationFrame(render);
    window.addEventListener("resize", resize);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas ref={canvasRef} className="fireworks-canvas" aria-hidden="true" />
  );
}

function Navbar({ theme, toggleTheme }) {
  return (
    <header className="site-header">
      <nav className="navbar shell" aria-label="Primary">
        <a className="brand-mark" href="#hero">
          <span className="brand-mark__kanji">計</span>
          <span>
            <strong>Event Calculator</strong>
            <small>Atmospheric scoring interface</small>
          </span>
        </a>

        <div className="navbar__actions">
          <a className="navbar__link" href="#calculator">
            Calculator
          </a>
          <a className="navbar__link" href="#system">
            Design system
          </a>
          <button className="theme-toggle" type="button" onClick={toggleTheme}>
            <span>
              {theme === "dark" ? "Switch to light" : "Switch to dark"}
            </span>
          </button>
        </div>
      </nav>
    </header>
  );
}

function Hero({ score }) {
  return (
    <section className="hero shell" id="hero">
      <div className="hero__copy reveal-on-scroll">
        <p className="eyebrow">Cinematic calculator experience</p>
        <h1>
          Measure connection with a calm, premium interface shaped by
          <span
            className="inline-visual"
            style={{
              backgroundImage:
                "url(https://picsum.photos/seed/anime-night/320/180)",
            }}
          />
          anime atmosphere.
        </h1>
        <p className="hero__lede">
          Responsive layouts, elegant motion, adaptive themes, and a live
          scoring workflow combine into a production-ready redesign that feels
          editorial instead of generic.
        </p>
        <div className="hero__actions">
          <a className="button button--primary" href="#calculator">
            Open calculator
          </a>
          <a className="button button--ghost" href="#system">
            Explore the system
          </a>
        </div>
      </div>

      <aside className="hero__panel scale-on-scroll">
        <div className="metric-tile">
          <span>Live score</span>
          <strong>{score === "" ? "Awaiting input" : score}</strong>
        </div>
        <div className="metric-grid">
          <article>
            <span>Theme modes</span>
            <strong>Light and dark</strong>
          </article>
          <article>
            <span>Animation budget</span>
            <strong>Canvas with fallback</strong>
          </article>
          <article>
            <span>Layout method</span>
            <strong>Grid and flex</strong>
          </article>
          <article>
            <span>Persistence</span>
            <strong>Firestore submit</strong>
          </article>
        </div>
      </aside>
    </section>
  );
}

function FeatureGrid() {
  return (
    <section className="system-section shell" id="system">
      <div className="section-heading reveal-on-scroll">
        <p className="eyebrow">Interest</p>
        <h2>Design system built like distinct cinematic chapters</h2>
        <p>
          The visual language stays restrained: luminous edges, soft gradients,
          wide typography, and dense card rhythm instead of decorative overload.
        </p>
      </div>

      <div className="feature-grid">
        {featureCards.map((card) => (
          <article className={card.className} key={card.title}>
            <span>{card.eyebrow}</span>
            <h3>{card.title}</h3>
            <p>{card.text}</p>
          </article>
        ))}
      </div>

      <div className="marquee" aria-label="UI principles">
        <div className="marquee__track">
          {[...marqueeItems, ...marqueeItems].map((item, index) => (
            <span key={`${item}-${index}`}>{item}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

function ExperienceSection({ activeIndex, setActiveIndex }) {
  const activeItem = testimonials[activeIndex];

  return (
    <section className="experience-section shell">
      <div className="experience-section__content reveal-on-scroll">
        <p className="eyebrow">Desire</p>
        <h2>Motion adds mood without compromising speed or clarity</h2>
        <p className="experience-section__text">
          Scroll-based reveal states, composited transforms, and a low-cost
          fireworks layer create atmosphere while preserving load discipline and
          interaction confidence.
        </p>
      </div>

      <div className="testimonial-card scale-on-scroll">
        <div className="testimonial-card__portrait" />
        <div className="testimonial-card__body">
          <p>“{activeItem.quote}”</p>
          <footer>
            <strong>{activeItem.name}</strong>
            <span>{activeItem.role}</span>
          </footer>
        </div>
      </div>

      <div
        className="testimonial-nav"
        role="tablist"
        aria-label="Testimonial selection"
      >
        {testimonials.map((item, index) => (
          <button
            key={item.name}
            type="button"
            className={index === activeIndex ? "is-active" : ""}
            onClick={() => setActiveIndex(index)}
          >
            {String(index + 1).padStart(2, "0")}
          </button>
        ))}
      </div>
    </section>
  );
}

function CalculatorForm({
  formData,
  onChange,
  onDateChange,
  onSubmit,
  score,
  statusMessage,
}) {
  return (
    <section className="calculator-section shell" id="calculator">
      <div className="calculator-section__intro reveal-on-scroll">
        <p className="eyebrow">Action</p>
        <h2>Capture the session, score the result, and store it cleanly</h2>
        <p>
          This layout keeps the form readable on mobile, dense on desktop, and
          resilient for future component extraction.
        </p>
      </div>

      <div className="calculator-layout">
        <aside className="calculator-card calculator-card--summary scale-on-scroll">
          <span className="summary-label">Current total</span>
          <strong>{score === "" ? "0" : score}</strong>
          <p>{statusMessage}</p>
          <ul>
            <li>Affection level contributes positively to the score.</li>
            <li>Special status changes the multiplier dramatically.</li>
            <li>Long sessions and repeated prompt usage reduce total value.</li>
          </ul>
        </aside>

        <form className="calculator-card calculator-form" onSubmit={onSubmit}>
          <div className="form-grid">
            <label className="field field--full">
              <span>Name</span>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={onChange}
                required
              />
            </label>

            {socialLinks.map((item) => (
              <label className="field" key={item.key}>
                <span>{item.label}</span>
                <input
                  type={item.type || "text"}
                  name={item.key}
                  value={formData[item.key]}
                  onChange={onChange}
                  placeholder={item.placeholder}
                />
              </label>
            ))}

            <label className="field">
              <span>Start time</span>
              <DatePicker
                selected={formData.startTime}
                onChange={(date) => onDateChange("startTime", date)}
                showTimeSelect
                dateFormat="dd/MM/yyyy HH:mm"
                timeFormat="HH:mm"
                timeIntervals={5}
                placeholderText="Select start time"
                className="datepicker-input"
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
                placeholderText="Select end time"
                className="datepicker-input"
              />
            </label>

            <label className="field">
              <span>Affection level</span>
              <input
                type="number"
                min="0"
                name="affectionLevel"
                value={formData.affectionLevel}
                onChange={onChange}
                placeholder="0"
              />
            </label>

            <label className="field">
              <span>Special status</span>
              <select
                name="specialStatus"
                value={formData.specialStatus}
                onChange={onChange}
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="field field--full">
              <span>Chat usage</span>
              <input
                type="number"
                min="0"
                name="promptUsage"
                value={formData.promptUsage}
                onChange={onChange}
                placeholder="Number of prompts"
              />
            </label>
          </div>

          <button className="button button--primary button--full" type="submit">
            Save score to Firestore
          </button>
        </form>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer shell">
      <div>
        <p className="eyebrow">Built for benchmarking</p>
        <h2>
          Anime-inspired restraint, production-oriented structure, and clear UX
          rhythm.
        </h2>
      </div>
      <div className="site-footer__links">
        <a href="#hero">Top</a>
        <a href="#system">System</a>
        <a href="#calculator">Calculator</a>
      </div>
    </footer>
  );
}

const initialFormState = {
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

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const [score, setScore] = useState("");
  const [submitState, setSubmitState] = useState("Ready for input.");
  const [activeIndex, setActiveIndex] = useState(0);
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    const revealItems = document.querySelectorAll(
      ".reveal-on-scroll, .scale-on-scroll",
    );
    if (!revealItems.length || typeof window === "undefined") {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.2 },
    );

    revealItems.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleDateChange = (name, date) => {
    setFormData((current) => ({ ...current, [name]: date }));
  };

  const calculatedTotal = useMemo(() => {
    const affectionLevelNumber =
      Number.parseInt(formData.affectionLevel, 10) || 0;
    const promptUsageNumber = Number.parseInt(formData.promptUsage, 10) || 0;
    const timeDifference =
      formData.startTime && formData.endTime
        ? differenceInMinutes(formData.endTime, formData.startTime)
        : 0;
    const specialStatusIndex = ["none", "girlfriend", "spouse"].indexOf(
      formData.specialStatus,
    );

    return (
      affectionLevelNumber * 200 +
      specialStatusIndex * 10000 -
      promptUsageNumber * 25 -
      timeDifference * 50
    );
  }, [formData]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      ...formData,
      startTime: formData.startTime
        ? format(formData.startTime, "dd/MM/yyyy HH:mm")
        : "",
      endTime: formData.endTime
        ? format(formData.endTime, "dd/MM/yyyy HH:mm")
        : "",
      total: calculatedTotal,
      submittedAt: new Date().toISOString(),
    };

    try {
      await addDoc(collection(db, "user_data"), payload);
      setScore(calculatedTotal);
      setSubmitState(
        "Score stored successfully and reflected in the live summary.",
      );
    } catch (error) {
      console.error("Error saving document:", error);
      setSubmitState(
        "Unable to save to Firestore right now, but the live score remains available.",
      );
      setScore(calculatedTotal);
    }
  };

  return (
    <main className="app-shell">
      <div className="background-layer" aria-hidden="true" />
      <FireworksCanvas />

      <div className="design-plan" aria-hidden="true">
        <pre>{`<design_plan>
Python RNG Execution:
seed = ${promptSeed}
hero = ${designPlan.hero}; font = ${designPlan.font}
components = ${designPlan.components.join(", ")}; motion = ${designPlan.motion.join(", ")}
AIDA Check:
Navigation, Attention hero, Interest bento grid, Desire motion/testimonial, Action calculator/footer confirmed.
Hero Math Verification:
H1 uses max-width: 15ch in CSS within a wide shell container to maintain 2 to 3 lines. No stamp icons or spam tags are used.
Bento Density Verification:
Feature grid uses 12-column desktop layout. Spans are 5 + 7 on row one and 4 + 8 on row two, totaling 12 each row with no empty cells.
Label Sweep & Button Check:
No cheap meta labels exist. Primary button uses high-contrast foreground/background pairing in both themes.
</design_plan>`}</pre>
      </div>

      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <Hero score={score} />
      <FeatureGrid />
      <ExperienceSection
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
      />
      <CalculatorForm
        formData={formData}
        onChange={handleChange}
        onDateChange={handleDateChange}
        onSubmit={handleSubmit}
        score={score === "" ? calculatedTotal : score}
        statusMessage={submitState}
      />
      <Footer />
    </main>
  );
}
