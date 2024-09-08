import { motion } from "framer-motion";
import { useState } from "react";
import { useTranslation } from "next-i18next";

const FeaturesSection = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const { t } = useTranslation();

  const features = [
    {
      title: t("Advanced Charting Tools"),
      description: t(
        "Utilize sophisticated charting tools to analyze market trends and make informed trading decisions."
      ),
      icon: (
        <svg
          className="flex-shrink-0 mt-2 size-6 md:size-7 hs-tab-active:text-blue-600 text-muted-800 dark:hs-tab-active:text-blue-500 dark:text-muted-200"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z" />
          <path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z" />
          <path d="M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0z" />
          <path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z" />
          <path d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z" />
        </svg>
      ),
      imageUrl: "/img/home/chart.webp",
    },
    {
      title: t("Real-Time Market Data"),
      description: t(
        "Stay ahead with real-time updates on market prices, trends, and news."
      ),
      icon: (
        <svg
          className="flex-shrink-0 mt-2 size-6 md:size-7 hs-tab-active:text-blue-600 text-muted-800 dark:hs-tab-active:text-blue-500 dark:text-muted-200"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m12 14 4-4" />
          <path d="M3.34 19a10 10 0 1 1 17.32 0" />
        </svg>
      ),
      imageUrl: "/img/home/markets.webp",
    },
    {
      title: t("Powerful Trading Algorithms"),
      description: t(
        "Deploy advanced trading algorithms to maximize your trading efficiency and profitability."
      ),
      icon: (
        <svg
          className="flex-shrink-0 mt-2 size-6 md:size-7 hs-tab-active:text-blue-600 text-muted-800 dark:hs-tab-active:text-blue-500 dark:text-muted-200"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
          <path d="M5 3v4" />
          <path d="M19 17v4" />
          <path d="M3 5h4" />
          <path d="M17 19h4" />
        </svg>
      ),
      imageUrl: "/img/home/order.webp",
    },
  ];

  return (
    <section className="w-full px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto dark:bg-black bg-white dark:bg-dot-white/[0.2] bg-dot-black/[0.2] relative">
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <div className="max-w-7xl relative p-6 md:p-16 px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="relative z-10 lg:grid lg:grid-cols-12 lg:gap-16 lg:items-center">
          <div className="mb-10 lg:mb-0 lg:col-span-6 lg:col-start-8 lg:order-2">
            <h2 className="text-2xl text-muted-800 font-bold sm:text-3xl dark:text-muted-200">
              {t("Make the most of your trading experience")}
            </h2>

            <nav
              className="grid gap-4 mt-5 md:mt-10"
              aria-label="Tabs"
              role="tablist"
            >
              {features.map((feature, index) => (
                <motion.button
                  type="button"
                  key={index}
                  className={`${
                    activeFeature === index
                      ? "bg-muted-50 shadow-md border-transparent dark:bg-muted-800"
                      : "hover:bg-muted-200 dark:hover:bg-muted-800"
                  } text-start p-4 md:p-5 rounded-xl`}
                  id={`tabs-with-card-item-${index}`}
                  data-hs-tab={`#tabs-with-card-${index}`}
                  aria-controls={`tabs-with-card-${index}`}
                  role="tab"
                  onClick={() => setActiveFeature(index)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  <span className="flex">
                    {feature.icon}
                    <span className="grow ms-6">
                      <span className="block text-lg font-semibold hs-tab-active:text-blue-600 text-muted-800 dark:hs-tab-active:text-blue-500 dark:text-muted-200">
                        {feature.title}
                      </span>
                      <span className="block mt-1 text-muted-800 dark:hs-tab-active:text-muted-200 dark:text-muted-200">
                        {feature.description}
                      </span>
                    </span>
                  </span>
                </motion.button>
              ))}
            </nav>
          </div>

          <div className="lg:col-span-6">
            <div className="relative">
              <div>
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    id={`tabs-with-card-${index}`}
                    role="tabpanel"
                    aria-labelledby={`tabs-with-card-item-${index}`}
                    className={`shadow-xl shadow-muted-200 rounded-xl dark:shadow-muted-900/20 ${
                      activeFeature === index ? "" : "hidden"
                    }`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: activeFeature === index ? 1 : 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <img
                      src={feature.imageUrl}
                      alt={feature.title}
                      className="w-full h-auto rounded-xl"
                    />
                  </motion.div>
                ))}
              </div>

              <div className="hidden absolute top-0 end-0 translate-x-20 md:block lg:translate-x-20">
                <svg
                  className="w-16 h-auto text-orange-500"
                  width="121"
                  height="135"
                  viewBox="0 0 121 135"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 16.4754C11.7688 27.4499 21.2452 57.3224 5 89.0164"
                    stroke="currentColor"
                    strokeWidth="10"
                    strokeLinecap="round"
                  />
                  <path
                    d="M33.6761 112.104C44.6984 98.1239 74.2618 57.6776 83.4821 5"
                    stroke="currentColor"
                    strokeWidth="10"
                    strokeLinecap="round"
                  />
                  <path
                    d="M50.5525 130C68.2064 127.495 110.731 117.541 116 78.0874"
                    stroke="currentColor"
                    strokeWidth="10"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 grid grid-cols-12 size-full">
          <div className="col-span-full lg:col-span-7 lg:col-start-6 bg-muted-100 w-full h-5/6 rounded-xl sm:h-3/4 lg:h-full dark:bg-muted-900"></div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
