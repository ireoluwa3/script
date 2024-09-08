import React, { useRef, useState, useEffect } from "react";
import bannerBg from "/public/img/home/banner-bg.svg";
import bannerBgDark from "/public/img/home/banner-bg-dark.svg";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useTranslation } from "next-i18next";

const BannerSection: React.FC = () => {
  const headingRef = useRef(null);
  const linkRef = useRef(null);
  const [isHeadingVisible, setHeadingVisible] = useState(false);
  const [isLinkVisible, setLinkVisible] = useState(false);
  const isHeadingInView = useInView(headingRef);
  const isLinkInView = useInView(linkRef);
  const { t } = useTranslation();

  useEffect(() => {
    setHeadingVisible(isHeadingInView);
  }, [isHeadingInView]);

  useEffect(() => {
    setLinkVisible(isLinkInView);
  }, [isLinkInView]);

  return (
    <section className="w-full pb-10 px-4 sm:px-6 lg:px-8 md:pb-20 mx-auto dark:bg-black bg-white dark:bg-dot-white/[0.2] bg-dot-black/[0.2] md:h-auto relative pt-16">
      {/* Radial gradient for the container to give a faded look */}
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>

      <div className="max-w-7xl relative pt-6 lg:pt-0 px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="relative rounded-xl p-5 sm:py-16 bg-muted-100 dark:bg-neutral-950">
          <div className="absolute inset-0 dark:hidden">
            <img
              src={bannerBg.src}
              alt="Banner Background"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 hidden dark:block">
            <img
              src={bannerBgDark.src}
              alt="Banner Background"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative z-10 text-center mx-auto max-w-xl">
            <div className="mb-5">
              <motion.h2
                className="text-3xl md:text-8xl lg:text-6xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isHeadingVisible
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 20 }
                }
                transition={{ duration: 1 }}
                ref={headingRef}
              >
                {t("Start Your Crypto Journey Now!")}
              </motion.h2>
              <motion.div
                className="mt-8 flex justify-center items-center space-x-4"
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isLinkVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ duration: 1, delay: 0.5 }}
                ref={linkRef}
              >
                <Link href="/login" className="p-[3px] relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
                  <div className="px-8 py-[7px] bg-black rounded-[6px] relative group transition duration-200 text-white hover:bg-transparent text-xl">
                    {t("Get Started")}
                  </div>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BannerSection;
