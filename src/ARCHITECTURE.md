# Architecture & Design Decisions

## Overview

This is a production-ready redesign of the Score Calculator, retaining all original business logic (form state, scoring algorithm, Firebase submission) while replacing the entire UI layer with an anime-inspired, accessible, and performant design system.

---

## Tech Stack Justification

- **React 18 (CRA)**: Existing framework; preserved to avoid migration cost.
- **CSS Modules + CSS Custom Properties**: Zero build-time dependencies, full tree-shaking, scoped styles, and runtime theme switching without JS bloat.
- **Google Fonts (`Outfit`)**: Geometric sans-serif with excellent legibility and an anime-adjacent modern feel. Loaded with `display=swap` for LCP safety.
- **No animation libraries**: All motion is CSS transitions or raw `requestAnimationFrame` Canvas2D. This avoids adding ~30-60 KB to the bundle.

---

## Design System

### Color Palette (Anime-Inspired, Not Neon Overload)

- **Violet** (`#7C3AED` / `#A78BFA`): Primary brand / focus accent.
- **Pink** (`#F472B6` / `#F9A8D4`): Secondary warmth / gradient partner.
- **Teal** (`#2DD4BF` / `#5EEAD4`): Success / contrast accent.
- **Gold** (`#FBBF24`): Tertiary highlight (used in fireworks).

Light and dark themes swap these tones but keep the same contrast ratios, ensuring WCAG AA readability targets.

### Typography

- `Outfit` at 300/400/500/600/700/800 weights.
- Fluid `clamp()` scale: everything scales smoothly from mobile (`~360px`) to desktop (`~1440px`) without arbitrary breakpoint jumps.

### Spacing

- 8px base unit, used consistently for padding, gaps, and component internal rhythm.

---

## Component Architecture

```
App
└── ThemeProvider
    ├── FireworksCanvas   (lazy-loaded background)
    └── CalculatorPage
        ├── ThemeToggle
        └── AnimeCard
            ├── ScoreDisplay
            └── Form
                ├── AnimeInput
                ├── AnimeSelect
                └── AnimeButton
```

### Key Components

| Component                   | Responsibility                                                                  |
| --------------------------- | ------------------------------------------------------------------------------- |
| `ThemeContext` / `useTheme` | Persists choice to `localStorage`; falls back to system `prefers-color-scheme`. |
| `FireworksCanvas`           | Canvas2D particle system. Lazy-loaded via `React.lazy` + `Suspense`.            |
| `AnimeCard`                 | Glassmorphism container (`backdrop-filter`, gradient border glow).              |
| `AnimeInput`                | Accessible floating-label input with focus underline.                           |
| `AnimeSelect`               | Styled native `<select>` with custom chevron.                                   |
| `AnimeButton`               | Gradient CTA with shine sweep hover effect.                                     |
| `ScoreDisplay`              | Animated number counter (`useAnimatedNumber`).                                  |

---

## Performance Considerations

### 1. Fireworks Optimizations

- **Object Pooling**: Both rockets and particles reuse objects to minimize GC pauses.
- **Particle Cap**: Hard limit of 280 active particles. Excess spawn requests are dropped.
- **DPR Cap**: `devicePixelRatio` is capped at `2`. On 3× devices this halves the pixel fill load with negligible visual loss.
- **Lifecycle Awareness**:
  - `IntersectionObserver` pauses the loop when the canvas is off-screen.
  - `visibilitychange` pauses when the tab is hidden.
- **Theme-Aware Clearing**: The canvas trail clear-color matches the CSS background color so fireworks look good in both light and dark modes.

### 2. Bundle & Load

- `FireworksCanvas` is code-split (`React.lazy`). The interactive form loads instantly; fireworks load asynchronously.
- No additional JS libraries for animation or theming. Total new dependency weight: **0 KB**.
- CSS is modular: only used styles are bundled per-component.

### 3. Layout Stability (CLS)

- All inputs use `min-height` and stable box models.
- No content that shifts after fonts load (critical text is either small or hidden until interaction).

---

## Accessibility

- **Focus rings**: Visible `outline` on all interactive elements; WCAG 2.2 compliant.
- **Reduced Motion**: `prefers-reduced-motion` disables all CSS animations and the Canvas effect respects the same (via manual user choice and OS setting).
- **ARIA**: Live region on `ScoreDisplay` so screen readers announce score updates.

---

## Tradeoffs

1. **No Tailwind**: Chose CSS Modules to avoid a ~3 MB dev dependency and keep the build fast. The tradeoff is slightly more manual theming, which is acceptable for a single-page app.
2. **No WebGL**: Canvas2D is simpler, smaller, and sufficient for 2D fireworks. The tradeoff is slightly less photorealistic explosions, but performance wins are substantial.
3. **No Routing**: The requirement was a single focused calculator page; adding a router would be unnecessary bloat.

---

## Extension Notes

- Add a new input: wrap it in an `AnimeInput` or `AnimeSelect`. No style changes needed.
- Add a new page: create a `pages/*` folder, import shared UI from `components/ui/*`, wrap root with `ThemeProvider`.
- Change palette: edit `src/styles/tokens.css` custom properties only.
