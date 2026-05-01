import { useState, useEffect, useRef } from "react";

function easeOutQuart(t) {
  return 1 - Math.pow(1 - t, 4);
}

export function useAnimatedNumber(target, duration = 900) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef(null);
  const startTimeRef = useRef(null);
  const fromRef = useRef(0);
  const displayRef = useRef(display);

  // Keep ref in sync without triggering re-runs
  displayRef.current = display;

  useEffect(() => {
    fromRef.current = displayRef.current;
    startTimeRef.current = null;

    const step = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutQuart(progress);
      const current = fromRef.current + (target - fromRef.current) * eased;
      setDisplay(Math.round(current));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    };

    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return display;
}
