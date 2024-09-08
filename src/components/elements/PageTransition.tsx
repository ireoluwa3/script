import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";
import { locales } from "../layouts/shared/Locales/Locales";

interface PageTransitionProps {
  children: ReactNode;
}

const pageVariants = {
  initial: {
    opacity: 0,
    scale: 0.98,
  },
  in: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
  out: {
    opacity: 0,
    scale: 0.98,
    transition: {
      duration: 0.2,
      ease: "easeIn",
    },
  },
};

const PageTransition = ({ children }: PageTransitionProps) => {
  const router = useRouter();
  const [isAnimating, setIsAnimating] = useState(false);
  const [key, setKey] = useState(router.asPath);

  const getPathnameWithoutLocale = (url: string) => {
    if (typeof url !== "string") return ""; // or handle this case as needed
    const urlParts = url.split("/");
    if (
      urlParts.length > 1 &&
      locales.some((locale) => locale.code === urlParts[1])
    ) {
      urlParts.splice(1, 1);
    }
    return urlParts.join("/");
  };

  useEffect(() => {
    const handleRouteChangeStart = (url: string) => {
      if (
        getPathnameWithoutLocale(url) !==
        getPathnameWithoutLocale(router.asPath)
      ) {
        setIsAnimating(true);
      }
    };

    const handleRouteChangeComplete = (url: string) => {
      const newKey = url;
      if (
        getPathnameWithoutLocale(newKey) !==
        getPathnameWithoutLocale(router.asPath)
      ) {
        setKey(newKey);
      }
      setIsAnimating(false);
    };

    router.events.on("routeChangeStart", handleRouteChangeStart);
    router.events.on("routeChangeComplete", handleRouteChangeComplete);
    router.events.on("routeChangeError", handleRouteChangeComplete);

    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart);
      router.events.off("routeChangeComplete", handleRouteChangeComplete);
      router.events.off("routeChangeError", handleRouteChangeComplete);
    };
  }, [router]);

  const shouldAnimate = (url1: string, url2: string) => {
    const path1 = getPathnameWithoutLocale(url1);
    const path2 = getPathnameWithoutLocale(url2);
    const tradeOrBinaryRegex = /^(\/trade\/[^\/]+|\/binary\/[^\/]+)$/;
    return !(tradeOrBinaryRegex.test(path1) && tradeOrBinaryRegex.test(path2));
  };

  return (
    <AnimatePresence mode="wait">
      {(!isAnimating || shouldAnimate(key, router.asPath)) && (
        <motion.div
          key={key}
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          className="hidden-scrollbar"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PageTransition;
