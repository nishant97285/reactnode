import Hero1 from "../assets/HeroSection1/Slides1.webp";
import Hero2 from "../assets/HeroSection1/Slides2.webp";
import Hero3 from "../assets/HeroSection1/Slides3.webp";
import Hero4 from "../assets/HeroSection1/Slides4.webp";

import { useState, useEffect, useRef } from "react";

const slides = [Hero1, Hero2, Hero3, Hero4];

const HeroSection = () => {
  const [current, setCurrent] = useState(0);
  const autoRef = useRef(null);

  const resetAuto = () => {
    clearInterval(autoRef.current);
    autoRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
  };

  useEffect(() => {
    resetAuto();
    return () => clearInterval(autoRef.current);
  }, []);

  const handleDot = (i) => {
    setCurrent(i);
    resetAuto();
  };

  return (
    <div className="relative w-full overflow-hidden ">
      <img
        src={slides[current]}
        alt={`Kapiva Banner ${current + 1}`}
        className="w-full max-w-none h-[450px] md:h-[450px] lg:h-[440px] object-contain"
      />

      {/* DOTS */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => handleDot(i)}
            className="h-2.5 rounded-full transition-all duration-300 focus:outline-none"
            style={{
              width: i === current ? 26 : 10,
              background: i === current ? "#333333" : "#bbbbbb",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSection;
