import { useState } from "react";
import { Link, useLocation } from "react-router-dom"; 
import { useScroll } from "../hooks/useScroll";
import SideDrawer from "./SideDrawer";

import gym from "../assets/mobile-categories/gym.png";
import energy from "../assets/mobile-categories/Energy.png";
import sugar from "../assets/mobile-categories/sugar.png";
import heart from "../assets/mobile-categories/heart.png";
import forHer from "../assets/mobile-categories/female.png";
import skin from "../assets/mobile-categories/herbs.png";
import promoBg from "../assets/Promotion/Promotion.png";

const mobileCategories = [
  { label: "Gym", icon: gym },
  { label: "Energy", icon: energy },
  { label: "Sugar", icon: sugar },
  { label: "Heart", icon: heart },
  { label: "For Her", icon: forHer },
  { label: "Skin", icon: skin },
];

const Navbar = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const isDashboard = location.pathname.startsWith("/dash");

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [bannerVisible, setBannerVisible] = useState(true);
  const scrolled = useScroll(20);

  // 🔥 Dashboard pe navbar hide
  if (isDashboard) return null;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 bg-white transition-shadow duration-300 ${
          scrolled ? "shadow-md" : "shadow-sm"
        }`}
      >
        {/* PROMO BANNER */}
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            bannerVisible
              ? "max-h-16 opacity-100"
              : "max-h-0 opacity-0 pointer-events-none"
          }`}
          style={{
            backgroundImage: `url(${promoBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="flex items-center justify-between sm:justify-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 relative flex-wrap sm:flex-nowrap">
            <button
              onClick={() => setBannerVisible(false)}
              className="absolute left-2 top-1/2 -translate-y-1/2 border border-white/40 rounded text-white text-xs sm:text-sm w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 sm:gap-3 ml-6 sm:ml-8 flex-1 min-w-0">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white flex items-center justify-center shrink-0">
                <span className="text-green-600 font-black text-[10px] sm:text-xs">
                  K
                </span>
              </div>
              <p className="text-white font-bold text-[10px] sm:text-xs md:text-sm tracking-wide sm:tracking-widest uppercase truncate sm:whitespace-normal">
                Additional 10% Off With Kapiva Coins
              </p>
            </div>

            <button className="bg-green-500 hover:bg-green-600 text-white text-[10px] sm:text-xs font-bold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded tracking-wide shrink-0">
              GET APP
            </button>
          </div>
        </div>

        {/* MOBILE NAVBAR */}
        <div className="md:hidden">
          {/* Top Row: Hamburger + Brand + Icons */}
          <div className="flex items-center justify-between px-3 py-3">
           {/* Hamburger Button */}
<button
  onClick={() => setMenuOpen(!menuOpen)}
  className="flex flex-col gap-1.5 p-1"
>
  <span
    className={`block w-5 h-0.5 bg-gray-700 transform transition-all duration-600 ease-out ${
      menuOpen ? "rotate-45 translate-y-2" : ""
    }`}
  />
  <span
    className={`block w-5 h-0.5 bg-gray-700 transform transition-all duration-600 ease-out ${
      menuOpen ? "opacity-0" : ""
    }`}
  />
  <span
    className={`block w-5 h-0.5 bg-gray-700 transform transition-all duration-600 ease-out ${
      menuOpen ? "-rotate-45 -translate-y-2" : ""
    }`}
  />
</button>

            <div className="bg-black text-white font-black text-base px-3 py-1.5 tracking-widest rounded">
             <Link to="/">KAPIVA</Link>
            </div>

            <div className="flex items-center gap-1">
              <button className="text-gray-700 text-xl p-1.5">🔍</button>
              <button className="text-gray-700 text-xl p-1.5">🚚</button>
              <Link
                to="/dash"
                className="text-gray-700 text-xl p-1.5"
                title="dashboard"
              >
                👤
              </Link>
              <button className="relative text-gray-700 text-xl p-1.5">
                🛒
                <span className="absolute top-0.5 right-0.5 bg-green-500 text-white text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold leading-none">
                  0
                </span>
              </button>
            </div>
          </div>

          {/* ONLY SHOW LOCATION & MOBILE CATEGORIES ON HOMEPAGE */}
          {isHomePage && (
            <>
              {/* LOCATION ROW */}
              <div className="flex items-center justify-between px-3 pb-2 border-b border-gray-100">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">📍</span>
                  <div>
                    <p className="font-semibold text-gray-800 text-xs">
                      140119, Chandigarh
                    </p>
                    <p className="text-gray-500 text-[11px]">
                      Verify pincode for accurate delivery
                    </p>
                  </div>
                </div>
                <button className="border border-gray-400 text-gray-700 text-xs font-semibold px-3 py-1 rounded-md hover:bg-gray-50">
                  Edit ›
                </button>
              </div>

              {/* MOBILE CATEGORIES */}
              <div className="flex items-center overflow-x-auto scrollbar-hide px-7 py-2 gap-2">
                {mobileCategories.map((cat, index) => (
                  <div key={cat.label} className="flex items-center shrink-0">
                    <div className="flex flex-col items-center gap-1 cursor-pointer">
                      <div className="w-12 h-10 bg-gray-100 overflow-hidden flex items-center justify-center border border-gray-200 rounded-full">
                        <img
                          src={cat.icon}
                          alt={cat.label}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-[10px] text-gray-600 font-medium whitespace-nowrap">
                        {cat.label}
                      </span>
                    </div>
                    {index !== mobileCategories.length - 1 && (
                      <div className="mx-3 h-13 w-[1px] bg-gray-400"></div>
                    )}
                  </div>
                ))}
                <div className="shrink-0 text-gray-400 text-lg font-bold ml-1">›</div>
              </div>
            </>
          )}
        </div>

        {/* DESKTOP NAVBAR */}
        <div className="hidden md:block">
          <div className="max-w-7xl mx-auto px-4 h-18 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 shrink-0">
              <div className="bg-black text-white font-black text-lg px-3 py-1.5 tracking-widest rounded">
               <Link to="/">KAPIVA</Link>
              </div>
              <div className="text-[10px] text-gray-500 leading-tight">
                <div className="flex items-center gap-1">
                  <span>📍</span>
                  <span className="font-semibold text-gray-700">
                    140119, Chandigarh
                  </span>
                </div>
                <button className="text-green-600 hover:underline">
                  Verify pincode for accurate delivery »
                </button>
              </div>
            </div>

            <div className="flex-1 max-w-xl flex items-center gap-2 bg-gray-50 border border-gray-500 rounded-full px-4 py-2 hover:border-green-400 focus-within:border-green-500 focus-within:bg-white transition-all duration-200">
              <span className="text-gray-400">🔍</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='Search for "Energy"'
                className="bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400 w-full"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-gray-400 hover:text-gray-600 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button className="border border-[#1b1b1b] text-gray-700 text-xs font-semibold px-4 py-2 rounded-full hover:bg-gray-100 transition-colors">
                GET APP
              </button>

              {/* LOGIN / REGISTER */}
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="border border-[#1b1b1b] text-gray-700 text-xs font-semibold px-4 py-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  LOGIN
                </Link>

                <Link
                  to="/register"
                  className="bg-green-500 text-white text-xs font-semibold px-4 py-2 rounded-full hover:bg-green-600 transition-colors"
                >
                  REGISTER
                </Link>
              </div>

              <Link
                to="/dash"
                className="text-gray-600 hover:text-black p-2 text-xl rounded-full hover:bg-gray-100 transition-colors"
              >
                👤
              </Link>

              <button className="text-gray-600 hover:text-black p-2 text-xl rounded-full hover:bg-gray-100 transition-colors">
                🚚
              </button>

              <button className="relative text-gray-600 hover:text-black p-2 text-xl rounded-full hover:bg-gray-100 transition-colors">
                🛒
                <span className="absolute top-1 right-1 bg-green-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  0
                </span>
              </button>

              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex flex-col gap-1.5 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span
                  className={`block w-5 h-0.5 bg-gray-700 transition-all duration-300 ${
                    menuOpen ? "rotate-45 translate-y-2" : ""
                  }`}
                />
                <span
                  className={`block w-5 h-0.5 bg-gray-700 transition-all duration-300 ${
                    menuOpen ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`block w-5 h-0.5 bg-gray-700 transition-all duration-300 ${
                    menuOpen ? "-rotate-45 -translate-y-2" : ""
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <SideDrawer isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
};

export default Navbar;