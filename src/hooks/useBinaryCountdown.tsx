import { useEffect, useState } from "react";

export const formatTime = (timeInSeconds: number) => {
  const roundedTimeInSeconds = Math.floor(timeInSeconds);
  const hours = String(Math.floor(roundedTimeInSeconds / 3600)).padStart(
    2,
    "0"
  );
  const minutes = String(
    Math.floor((roundedTimeInSeconds % 3600) / 60)
  ).padStart(2, "0");
  const seconds = String(roundedTimeInSeconds % 60).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
};

const generateExpirations = () => {
  const expirations = [1, 2, 3, 5, 10, 15, 20, 30, 60, 120, 240, 360];
  const now = new Date();
  now.setSeconds(0, 0); // Round to the start of the next minute
  return expirations.map((minutes) => {
    const expirationTime = new Date(now.getTime() + minutes * 60000);
    return { minutes, expirationTime };
  });
};

export const useBinaryCountdown = () => {
  const [expirations, setExpirations] = useState(generateExpirations);
  const [expiry, setExpiry] = useState(
    expirations.find(
      (exp) => (exp.expirationTime.getTime() - new Date().getTime()) / 1000 > 15
    ) || expirations[0]
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const newExpirations = generateExpirations();
      setExpirations(newExpirations);

      const timeLeft = Math.round(
        (expiry.expirationTime.getTime() - new Date().getTime()) / 1000
      );

      if (timeLeft <= 15) {
        const nextExpiration = newExpirations.find(
          (exp) =>
            (exp.expirationTime.getTime() - new Date().getTime()) / 1000 > 15
        );
        if (nextExpiration) {
          setExpiry(nextExpiration);
        }
      }
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, [expiry]);

  return { expirations, expiry, setExpiry };
};
