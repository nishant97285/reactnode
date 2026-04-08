import { useState, useEffect } from "react";

const shopByItems = [
  "Daily Wellness", "Gym Foods", "Men's Health",
  "Blood Sugar & Chronic Care", "Heart Care", "Skin Care",
  "Hair Care", "Ayurvedic Juices", "Women's Health", "Weight Management",
];

const ingredientItems = [
  "Ashwagandha", "Shilajit", "Turmeric", "Giloy",
  "Triphala", "Neem", "Amla", "Brahmi",
];

const SideDrawer = ({ isOpen, onClose }) => {
  const [shopByOpen, setShopByOpen] = useState(true);
  const [ingredientsOpen, setIngredientsOpen] = useState(false);
  const [navbarHeight, setNavbarHeight] = useState(64);

  // ✅ Navbar ki actual height measure karo — banner change hone par bhi update ho
  useEffect(() => {
    const measure = () => {
      const nav = document.querySelector("nav");
      if (nav) setNavbarHeight(nav.offsetHeight);
    };
    measure();

    // Resize par bhi recalculate karo
    window.addEventListener("resize", measure);

    // MutationObserver — banner close hone par height change detect karo
    const nav = document.querySelector("nav");
    const observer = new MutationObserver(measure);
    if (nav) observer.observe(nav, { childList: true, subtree: true, attributes: true });

    return () => {
      window.removeEventListener("resize", measure);
      observer.disconnect();
    };
  }, [isOpen]);

  // ✅ Scroll lock
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <>
      {/* ══ BACKDROP — navbar ke bilkul neeche se ══ */}
      <div
        onClick={onClose}
        className="fixed left-0 right-0 bottom-0 z-40 transition-all duration-500"
        style={{
          top: `${navbarHeight}px`,
          backgroundColor: isOpen ? "rgba(0,0,0,0.45)" : "rgba(0,0,0,0)",
          backdropFilter: isOpen ? "blur(3px)" : "blur(0px)",
          WebkitBackdropFilter: isOpen ? "blur(3px)" : "blur(0px)",
          pointerEvents: isOpen ? "auto" : "none",
        }}
      />

      {/* ══ DRAWER — navbar ke bilkul neeche se ══ */}
      <div
          className="fixed right-0 bottom-0 z-50 bg-white flex flex-col w-[85%] sm:w-[70%] md:w-[45%] lg:w-[38%]"
        style={{
        top: `${navbarHeight}px`,
        boxShadow: "-8px 0 40px rgba(0,0,0,0.15)",
        transform: isOpen ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.6s cubic-bezier(0.77,0,0.175,1)",
        willChange: "transform",
  }}
>
        {/* Close Button */}
        {/* <div className="flex justify-end px-5 py-3 border-b border-gray-100">
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 hover:text-black transition-all duration-200 text-base"
          >
            ✕
          </button>
        </div> */}

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain">

          {/* Login */}
          <div className="px-4 py-3">
            <button className="w-full flex items-center gap-3 bg-[#5a7a3a] hover:bg-[#4a6a2a] text-white font-semibold text-sm px-4 py-3 rounded-lg transition-colors duration-200">
              <span className="text-lg">🤝</span>
              <span className="tracking-wide">Login</span>
            </button>
          </div>

          {/* Shop By */}
          <div className="border-t border-gray-100">
            <button
              onClick={() => setShopByOpen(!shopByOpen)}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors duration-150"
            >
              <div className="flex items-center gap-3">
                <span className="text-base">🛒</span>
                <span className="font-semibold text-gray-800 text-sm">Shop by</span>
              </div>
              <svg
                className="w-4 h-4 text-gray-400"
                style={{ transform: shopByOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s ease" }}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div
              className="overflow-hidden"
              style={{
                maxHeight: shopByOpen ? "520px" : "0px",
                transition: "max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              {shopByItems.map((item, i) => (
                <button
                  key={item}
                  className="w-full text-left px-14 py-2.5 text-sm text-gray-600 hover:text-[#5a7a3a] hover:bg-green-50 transition-colors duration-150"
                  style={{
                    opacity: shopByOpen ? 1 : 0,
                    transform: shopByOpen ? "translateX(0)" : "translateX(10px)",
                    transition: `opacity 0.25s ease ${i * 18}ms, transform 0.25s ease ${i * 18}ms`,
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Ingredients */}
          <div className="border-t border-gray-100">
            <button
              onClick={() => setIngredientsOpen(!ingredientsOpen)}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors duration-150"
            >
              <div className="flex items-center gap-3">
                <span className="text-base">🌿</span>
                <span className="font-semibold text-gray-800 text-sm">Ingredients</span>
              </div>
              <svg
                className="w-4 h-4 text-gray-400"
                style={{ transform: ingredientsOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s ease" }}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div
              className="overflow-hidden"
              style={{
                maxHeight: ingredientsOpen ? "420px" : "0px",
                transition: "max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              {ingredientItems.map((item, i) => (
                <button
                  key={item}
                  className="w-full text-left px-14 py-2.5 text-sm text-gray-600 hover:text-[#5a7a3a] hover:bg-green-50 transition-colors duration-150"
                  style={{
                    opacity: ingredientsOpen ? 1 : 0,
                    transform: ingredientsOpen ? "translateX(0)" : "translateX(10px)",
                    transition: `opacity 0.25s ease ${i * 18}ms, transform 0.25s ease ${i * 18}ms`,
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Static Links */}
          <div className="border-t border-gray-100 px-5 py-4 space-y-4">
            {["Blog", "Innovation Fund", "Download App"].map((link) => (
              <button key={link} className="w-full text-left text-sm font-semibold text-gray-800 hover:text-[#5a7a3a] transition-colors duration-150">
                {link}
              </button>
            ))}
          </div>

          {/* App Store Buttons */}
          <div className="px-5 pb-4 flex gap-3">
            <button className="flex-1 bg-black text-white rounded-xl px-3 py-2.5 flex items-center gap-2 hover:bg-gray-800 active:scale-95 transition-all duration-150">
              <span className="text-lg">▶</span>
              <div className="text-left">
                <p className="text-[9px] text-gray-300 leading-tight">GET IT ON</p>
                <p className="text-xs font-semibold leading-tight">Google Play</p>
              </div>
            </button>
            <button className="flex-1 bg-black text-white rounded-xl px-3 py-2.5 flex items-center gap-2 hover:bg-gray-800 active:scale-95 transition-all duration-150">
              <span className="text-lg"></span>
              <div className="text-left">
                <p className="text-[9px] text-gray-300 leading-tight">Download on the</p>
                <p className="text-xs font-semibold leading-tight">App Store</p>
              </div>
            </button>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 px-5 py-4 flex items-center justify-center gap-4">
            <button className="text-xs text-gray-500 hover:text-gray-800 transition-colors duration-150">Contact Us</button>
            <span className="text-gray-300 text-xs">|</span>
            <button className="text-xs text-gray-500 hover:text-gray-800 transition-colors duration-150">About Us</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideDrawer;