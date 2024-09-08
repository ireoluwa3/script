import { useCallback, useEffect, useState } from "react";

function useScroll(HEIGHT: number) {
  const [scrolled, setScrolled] = useState(false);

  const scrollMonitor = useCallback(() => {
    setScrolled(window.scrollY >= HEIGHT);
  }, [HEIGHT]);

  useEffect(() => {
    window.addEventListener("scroll", scrollMonitor);
    return () => {
      window.removeEventListener("scroll", scrollMonitor);
    };
  }, [scrollMonitor]);
  return scrolled;
}

export default useScroll;
