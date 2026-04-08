import { useState, useEffect, useRef, useCallback } from "react";

export function useSlider(total, interval = 4000) {
  const [current, setCurrent] = useState(0);
  const [animate, setAnimate] = useState(true);
  const autoRef = useRef(null);

  const resetAuto = useCallback(() => {
    clearInterval(autoRef.current);
    autoRef.current = setInterval(() => {
      setAnimate(false);
      setTimeout(() => {
        setCurrent((p) => (p + 1) % total);
        setAnimate(true);
      }, 300);
    }, interval);
  }, [total, interval]);

  useEffect(() => {
    resetAuto();
    return () => clearInterval(autoRef.current);
  }, [resetAuto]);

  const goTo = (idx) => {
    setAnimate(false);
    setTimeout(() => {
      setCurrent(idx);
      setAnimate(true);
    }, 300);
    resetAuto();
  };

  return { current, animate, goTo };
}