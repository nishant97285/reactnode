import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // agar instant chahiye ho toh "auto" kar dena
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;