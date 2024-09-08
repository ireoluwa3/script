"use client";
import { motion } from "framer-motion";
import React from "react";
import Input from "@/components/elements/form/input/Input";
import Link from "next/link";
import { useTranslation } from "next-i18next";

const siteName = process.env.NEXT_PUBLIC_SITE_NAME;
const columns = {
  col1: [
    {
      light: "/img/home/hero/6.webp",
      dark: "/img/home/hero-dark/6.webp",
    },
    {
      light: "/img/home/hero/13.webp",
      dark: "/img/home/hero-dark/13.webp",
    },
    {
      light: "/img/home/hero/9.webp",
      dark: "/img/home/hero-dark/9.webp",
    },
    {
      light: "/img/home/hero/16.webp",
      dark: "/img/home/hero-dark/16.webp",
    },
    {
      light: "/img/home/hero/6.webp",
      dark: "/img/home/hero-dark/6.webp",
    },
    {
      light: "/img/home/hero/13.webp",
      dark: "/img/home/hero-dark/13.webp",
    },
    {
      light: "/img/home/hero/9.webp",
      dark: "/img/home/hero-dark/9.webp",
    },
    {
      light: "/img/home/hero/16.webp",
      dark: "/img/home/hero-dark/16.webp",
    },
  ],
  col2: [
    {
      light: "/img/home/hero/10.webp",
      dark: "/img/home/hero-dark/10.webp",
    },
    {
      light: "/img/home/hero/7.webp",
      dark: "/img/home/hero-dark/7.webp",
    },
    {
      light: "/img/home/hero/11.webp",
      dark: "/img/home/hero-dark/11.webp",
    },
    {
      light: "/img/home/hero/14.webp",
      dark: "/img/home/hero-dark/14.webp",
    },
    {
      light: "/img/home/hero/12.webp",
      dark: "/img/home/hero-dark/12.webp",
    },
    {
      light: "/img/home/hero/5.webp",
      dark: "/img/home/hero-dark/5.webp",
    },
    {
      light: "/img/home/hero/10.webp",
      dark: "/img/home/hero-dark/10.webp",
    },
    {
      light: "/img/home/hero/7.webp",
      dark: "/img/home/hero-dark/7.webp",
    },
    {
      light: "/img/home/hero/11.webp",
      dark: "/img/home/hero-dark/11.webp",
    },
    {
      light: "/img/home/hero/14.webp",
      dark: "/img/home/hero-dark/14.webp",
    },
    {
      light: "/img/home/hero/12.webp",
      dark: "/img/home/hero-dark/12.webp",
    },
    {
      light: "/img/home/hero/5.webp",
      dark: "/img/home/hero-dark/5.webp",
    },
  ],
  col3: [
    {
      light: "/img/home/hero/1.webp",
      dark: "/img/home/hero-dark/1.webp",
    },
    {
      light: "/img/home/hero/4.webp",
      dark: "/img/home/hero-dark/4.webp",
    },
    {
      light: "/img/home/hero/8.webp",
      dark: "/img/home/hero-dark/8.webp",
    },
    {
      light: "/img/home/hero/15.webp",
      dark: "/img/home/hero-dark/15.webp",
    },
    {
      light: "/img/home/hero/2.webp",
      dark: "/img/home/hero-dark/2.webp",
    },
    {
      light: "/img/home/hero/1.webp",
      dark: "/img/home/hero-dark/1.webp",
    },
    {
      light: "/img/home/hero/4.webp",
      dark: "/img/home/hero-dark/4.webp",
    },
    {
      light: "/img/home/hero/8.webp",
      dark: "/img/home/hero-dark/8.webp",
    },
    {
      light: "/img/home/hero/15.webp",
      dark: "/img/home/hero-dark/15.webp",
    },
    {
      light: "/img/home/hero/2.webp",
      dark: "/img/home/hero-dark/2.webp",
    },
  ],
};

const HeroSection = () => {
  const { t } = useTranslation();

  return (
    <section className="w-full dark:bg-black bg-white dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex flex-col md:flex-row items-center justify-center md:h-auto relative">
      {/* Radial gradient for the container to give a faded look */}
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      {/* Hero */}
      <div className="max-w-7xl relative pt-12 lg:pt-0 px-4 sm:px-6 lg:px-8 mx-auto">
        {/* Grid */}
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="text-center md:text-left flex flex-col justify-center">
            <motion.h1
              className="text-6xl md:text-8xl lg:text-10xl font-bold text-muted-800 dark:text-muted-200"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              {t("Find the Next")}{" "}
              <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                {t("Crypto Gem")}
              </span>{" "}
              {t("on")} {siteName}
            </motion.h1>
            <motion.p
              className="mt-4 text-lg md:text-xl text-muted-600 dark:text-muted-400"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              {t(
                "We provide the latest information on the best cryptocurrencies to invest in."
              )}
            </motion.p>
            <motion.div
              className="mt-8 flex justify-center md:justify-start items-center space-x-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1 }}
            >
              <div className="max-w-xs">
                <Input
                  type="text"
                  placeholder={t("Enter your email")}
                  size={"lg"}
                  color={"contrast"}
                />
              </div>
              <Link href="/register" className="p-[3px] relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
                <div className="px-8 py-[7px] bg-black rounded-[6px] relative group transition duration-200 text-white hover:bg-transparent text-md">
                  {t("Sign Up Now")}
                </div>
              </Link>
            </motion.div>
          </div>
          {/* End Col */}
          <div
            className="w-full h-[20rem] sm:h-[30rem] lg:h-[35rem] overflow-hidden rounded-lg"
            style={{ perspective: "700px" }}
          >
            <div
              className="grid grid-cols-3 gap-12 w-[60rem] sm:w-[80rem] lg:w-[50rem] h-[55rem] md:h-[90rem] lg:h-[75rem] overflow-hidden origin-[50%_0%]"
              style={{
                transform:
                  "translate3d(7%, -2%, 0px) scale3d(0.9, 0.8, 1) rotateX(15deg) rotateY(-9deg) rotateZ(32deg)",
              }}
            >
              {Object.entries(columns).map(([key, images], colIndex) => (
                <div
                  key={colIndex}
                  className={`grid gap-9 w-full h-[440px] ${
                    colIndex === 0
                      ? "animation-sliding-img-up-1"
                      : colIndex === 1
                      ? "animation-sliding-img-down-1"
                      : "animation-sliding-img-up-2"
                  }`}
                >
                  {images.map((image, index) => (
                    <React.Fragment key={index}>
                      <img
                        className="w-full object-cover shadow-lg rounded-lg dark:shadow-neutral-900/80 dark:hidden border border-muted-200 dark:border-muted-800
            hover:border hover:border-primary-500 dark:hover:border dark:hover:border-primary-400 transition-all duration-300"
                        src={image.light}
                        alt={`Image ${index + 1}`}
                      />
                      <img
                        className="hidden w-full object-cover shadow-lg rounded-lg dark:shadow-neutral-900/80 dark:block border border-muted-200 dark:border-muted-800
            hover:border hover:border-primary-500 dark:hover:border dark:hover:border-primary-400 transition-all duration-300"
                        src={image.dark}
                        alt={`Image ${index + 1}`}
                      />
                    </React.Fragment>
                  ))}
                </div>
              ))}
            </div>
          </div>
          {/* End Col */}
        </div>
        {/* End Grid */}
      </div>
      {/* End Hero */}
    </section>
  );
};

export default HeroSection;
