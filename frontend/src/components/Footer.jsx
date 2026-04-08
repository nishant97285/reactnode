import { useState } from "react";
import banner from '../assets/footer/banner.png'

const Footer = () => {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  return (
    <>
      {/* ══════════════════════════════
          SUBSCRIBE BANNER
      ══════════════════════════════ */}    

    <div className="relative w-full py-16 px-4 flex flex-col items-center justify-center text-center overflow-hidden"
       style={{
       backgroundImage: `url(${banner})`,
       backgroundSize: "cover",
       backgroundPosition: "center",
       backgroundRepeat: "no-repeat",
       minHeight: 200,
     }}
>
   
 {/* Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="relative z-10 w-full flex flex-col items-center">
        {/* Text */}
        <h2
          className="text-4xl md:text-5xl text-white mb-6 leading-tight"
          style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontWeight: 400 }}
        >
          unlock offers &<br />subscribe for content
        </h2>

        {/* Phone input */}
        <div className="flex w-full max-w-lg">
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter Your Phone Number"
            className="flex-1 px-5 py-4 text-sm text-gray-700 bg-white outline-none"
            style={{ borderRadius: "4px 0 0 4px" }}
          />
          <button
            className="px-6 py-2.5 flex items-center justify-center text-black transition-all duration-200 hover:opacity-90 hover:scale-105"
            style={{ background: "#9af1df", borderRadius: "0 6px 6px 0", minWidth: 60 }}
          >
             <span className="text-3xl font-semibold leading-none">→</span>
          </button>
        </div>
        </div>
      </div>

      {/* ══════════════════════════════
          MAIN FOOTER
      ══════════════════════════════ */}
      <div className="bg-white py-12 px-4 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

            {/* ── Col 1: Logo + Address ── */}
            <div>
              <div
                className="inline-block border-2 border-black px-4 py-2 mb-5"
                style={{ borderRadius: 2 }}
              >
                <span className="font-black text-2xl tracking-widest text-black">
                  KAPIVA
                </span>
              </div>

              <p className="text-sm text-gray-600 leading-relaxed mb-5" style={{ fontStyle: "italic" }}>
                No 16-1 and 17-2,<br />
                Vaishnavi Tech Park,<br />
                Ambalipura Village,<br />
                Varthur Hobli, Varthur,<br />
                Bengaluru, Karnataka 560103
              </p>

              <div className="flex items-center gap-2 mb-3">
                <span className="text-gray-500">📞</span>
                <span className="text-sm text-gray-700 font-medium">1800-274-2575</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-gray-500">✉️</span>
                <span className="text-sm text-gray-700 font-medium">info@kapiva.in</span>
              </div>
            </div>

            {/* ── Col 2: Links left ── */}
            <div className="pt-1">
              {["SHOP ALL", "MY ACCOUNT", "FAQS", "INNOVATION FUND"].map((link) => (
                <button
                  key={link}
                  className="block text-sm font-bold text-gray-800 hover:text-green-700 transition-colors mb-5 tracking-wide"
                >
                  {link}
                </button>
              ))}

              {/* Also available on */}
              <div className="mt-6">
                <p className="text-xs text-gray-500 mb-3">Also available on:</p>
                <div className="flex flex-wrap items-center gap-3">
                  {[
                    { name: "amazon.in", color: "#ff9900", text: "amazon.in" },
                    { name: "Flipkart", color: "#2874f0", text: "Flipkart 🛒" },
                    { name: "zepto", color: "#8b2fc9", text: "zepto" },
                    { name: "Instamart", color: "#fc8019", text: "🛵 Instamart" },
                  ].map((platform) => (
                    <button
                      key={platform.name}
                      className="text-xs font-bold px-2 py-1 rounded border border-gray-200 hover:border-gray-400 transition-colors"
                      style={{ color: platform.color }}
                    >
                      {platform.text}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Col 3: Links right ── */}
            <div className="pt-1">
              {["ABOUT US", "BLOG", "MEDIA", "CONTACT US"].map((link) => (
                <button
                  key={link}
                  className="block text-sm font-bold text-gray-800 hover:text-green-700 transition-colors mb-5 tracking-wide"
                >
                  {link}
                </button>
              ))}
            </div>

            {/* ── Col 4: Mailing + Social + Payments ── */}
            <div>
              {/* Mailing list */}
              <p className="text-sm font-black tracking-widest text-gray-900 mb-3">
                JOIN OUR MAILING LIST
              </p>
              <div className="flex mb-6">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Email"
                  className="flex-1 px-4 py-3 text-sm border border-gray-300 outline-none focus:border-gray-500 transition-colors"
                  style={{ borderRadius: "4px 0 0 4px" }}
                />
                <button
                  className="px-4 py-3 text-white font-bold text-base transition-all hover:opacity-90"
                  style={{ background: "#4a9a8a", borderRadius: "0 4px 4px 0" }}
                >
                  →
                </button>
              </div>

              {/* Social */}
              <p className="text-sm font-black tracking-widest text-gray-900 mb-3">
                FOLLOW US
              </p>
              <div className="flex items-center gap-3 mb-6">
                {[
                  { icon: "📸", label: "Instagram" },
                  { icon: "📘", label: "Facebook" },
                  { icon: "▶️", label: "YouTube" },
                  { icon: "🐦", label: "Twitter" },
                ].map((s) => (
                  <button
                    key={s.label}
                    title={s.label}
                    className="w-10 h-10 rounded-full border-2 border-gray-900 flex items-center justify-center hover:bg-gray-900 hover:text-white transition-all text-base"
                  >
                    {s.icon}
                  </button>
                ))}
              </div>

              {/* We Accept */}
              <p className="text-xs text-gray-500 mb-2">We Accept:</p>
              <div className="flex flex-wrap items-center gap-2">
                {["Amazon Pay", "BHIM UPI", "💳", "🎨", "Mastercard", "RuPay", "VISA"].map((p) => (
                  <span
                    key={p}
                    className="text-[10px] font-bold text-gray-600 border border-gray-200 px-2 py-1 rounded"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ══════════════════════════════
          BOTTOM LINKS BAR
      ══════════════════════════════ */}
      <div className="bg-white border-t border-gray-100 py-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {["Privacy Policy", "Terms and Conditions", "Shipping Policy", "Cancellation Policy"].map((link) => (
            <button
              key={link}
              className="text-xs text-gray-500 hover:text-gray-800 transition-colors"
            >
              {link}
            </button>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════
          COPYRIGHT BAR
      ══════════════════════════════ */}
      <div
        className="py-3 px-4 text-center"
        style={{ background: "#1a3a2a" }}
      >
        <p className="text-xs text-white/80">
          Kapiva is a company of Adret Retail Private Limited © Copyright 2025 Kapiva
        </p>
      </div>
    </>
  );
};

export default Footer;