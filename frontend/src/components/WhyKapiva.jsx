import { useState } from "react";

const reasons = [
  {
    number: "01",
    title: "FORMULATED BY EXPERTS",
    subtitle: "AT KAPIVA ACADEMY OF AYURVEDA",
    description:
      "Experts at Kapiva Academy of Ayurveda, PhD's, and Ayurvedacharya with over 50 years of cumulative experience build formulations with scientifically and clinically tested ingredients, to make our proprietary products that help you reach your health goals.",
    align: "left",
  },
  {
    number: "02",
    title: "THE BEST INGREDIENTS",
    subtitle: "PASSED THROUGH TOUGHEST PROCESS",
    description:
      "We go the extra mile to source the best ingredients like Shilajit from 18000 ft. in the Himalayas, Aloe Vera from the Thar Desert, and Noni from Andamans. Our Hair Oils are made with herbs slowly heated with Oil for days or Body butter with Ghee 100 times washed. We manufacture our products in GMP-certified facilities, of which 8 are USFDA approved.",
    align: "right",
  },
  {
    number: "03",
    title: "HOLISTIC SOLUTIONS",
    subtitle: "FOR EVERY NEED",
    description:
      "Be it acne, hair fall, or diabetes, we don't stop at just giving you products as that is just one element of solving your problem. We also give free health expert advice, personalized diet plans, and lifestyle recommendations including Yoga Asanas.",
    align: "left",
  },
];

const newsItems = [
  {
    id: 1,
    logoText: "YourStory",
    description:
      "Most Admired D2C Brand of the Year in the Fitness & Wellness category.",
    logo: null,
  },
  {
    id: 2,
    logoText: "CNBC",
    description: "Featured Kapiva's Plans for Global Expansion",
    logo: null,
  },
  {
    id: 3,
    logoText: "The Week",
    description: "Featured Kapiva's brand film launch with Malaika Arora",
    logo: null,
  },
  {
    id: 4,
    logoText: "Washington Times",
    description:
      "Featured Kapiva Dia Free Juice as a solution to manage Diabetes",
    logo: null,
  },
  {
    id: 5,
    logoText: "Economic Times",
    description: "Featured Kapiva building the Ingestible Skincare Trend",
    logo: null,
  },
  {
    id: 6,
    logoText: "Forbes",
    description: "Kapiva among top 10 wellness brands in India",
    logo: null,
  },
  {
    id: 7,
    logoText: "Inc42",
    description: "Kapiva raises funding to expand product portfolio",
    logo: null,
  },
  {
    id: 8,
    logoText: "Mint",
    description:
      "Kapiva's Ayurvedic products gain popularity among millennials",
    logo: null,
  },
  {
    id: 9,
    logoText: "Hindu",
    description:
      "Kapiva revolutionizing traditional Ayurveda for modern consumers",
    logo: null,
  },
  {
    id: 10,
    logoText: "Business Today",
    description: "Kapiva named best wellness startup of the year",
    logo: null,
  },
];

const CARDS_PER_PAGE = 5;

const WhyKapiva = () => {
  const [newsPage, setNewsPage] = useState(0);

  const totalPages = Math.ceil(newsItems.length / CARDS_PER_PAGE);
  const visibleNews = newsItems.slice(
    newsPage * CARDS_PER_PAGE,
    newsPage * CARDS_PER_PAGE + CARDS_PER_PAGE,
  );

  return (
    <>
      {/* ══════════════════════════════
          WHY KAPIVA
      ══════════════════════════════ */}
      <div className="bg-white py-16 px-4 relative overflow-hidden">
        {/* Decorative — left */}
        {/* <div className="absolute left-0 top-1/4 pointer-events-none select-none">
          <div className="text-8xl" style={{ transform: "rotate(-20deg)" }}>
            🌿
          </div>
          <div className="text-6xl mt-4" style={{ transform: "rotate(10deg)" }}>
            🌶️
          </div>
        </div> */}

        {/* Decorative — right */}
        {/* <div className="absolute right-0 top-1/3 pointer-events-none select-none">
          <div className="text-8xl" style={{ transform: "rotate(20deg)" }}>
            🌸
          </div>
          <div
            className="text-6xl mt-4"
            style={{ transform: "rotate(-10deg)" }}
          >
            🍓
          </div>
        </div> */}

        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-12">
            Why Kapiva?
          </h2>

          <div className="space-y-14">
            {reasons.map((item) => (
              <div
                key={item.number}
                className={`flex flex-col ${
                  item.align === "right"
                    ? "items-end text-right"
                    : "items-start text-left"
                }`}
              >
                <span
                  className="text-6xl font-black mb-3 leading-none"
                  style={{ color: "#c8972a", opacity: 0.85 }}
                >
                  {item.number}
                </span>
                <p className="text-sm font-black text-gray-900 tracking-wide">
                  {item.title}
                </p>
                <p className="text-sm font-black text-gray-900 tracking-wide mb-3">
                  {item.subtitle}
                </p>
                <p className="text-sm text-gray-500 leading-relaxed max-w-md">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════
          IN THE NEWS
      ══════════════════════════════ */}
      <div className="bg-white py-12 px-4 border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">In the News</h2>

          {/* Stats */}
          <div className="text-center mb-8">
            <p
              className="text-xs font-semibold tracking-widest uppercase mb-1"
              style={{ color: "#c8972a" }}
            >
              Improving health with Ayurveda
            </p>
            <p className="text-4xl font-black" style={{ color: "#c8972a" }}>
              2M+
            </p>
            <p className="text-xs font-bold tracking-widest uppercase text-gray-500">
              Happy Ayurveda Consumers
            </p>
          </div>

          {/* 5 cards in a row */}
          <div className="overflow-hidden">
            <div className="flex gap-3 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide">
              {newsItems.map((item) => (
                <div
                  key={item.id}
                  className="snap-start shrink-0 w-[45%] sm:w-[30%] md:w-[22%] border border-gray-200 rounded-xl bg-white p-3 flex flex-col items-center text-center hover:shadow-md transition-shadow duration-200"
                >
                  {/* Logo circle */}
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3 overflow-hidden shrink-0">
                    {item.logo ? (
                      <img
                        src={item.logo}
                        alt={item.logoText}
                        className="w-full h-full object-contain p-1"
                      />
                    ) : (
                      <span className="text-[10px] font-bold text-gray-500 text-center leading-tight px-1">
                        {item.logoText}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Dots — page switch */}
          <div className="flex justify-center gap-2 mt-5">
            {newsItems.map((_, i) => (
              <div key={i} className="w-2 h-2 bg-gray-300 rounded-full" />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default WhyKapiva;
