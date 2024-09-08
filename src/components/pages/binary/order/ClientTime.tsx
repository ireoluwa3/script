import React, { useEffect, useState } from "react";
import { formatTime } from "@/hooks/useBinaryCountdown";

const ClientTimeBase = ({ expiry }) => {
  const [clientTime, setClientTime] = useState("");

  useEffect(() => {
    const updateClientTime = () => {
      const timeLeft = Math.max(
        0,
        Math.round(
          (expiry.expirationTime.getTime() - new Date().getTime()) / 1000
        )
      );
      setClientTime(formatTime(timeLeft));
    };

    updateClientTime();
    const interval = setInterval(updateClientTime, 1000);

    return () => clearInterval(interval);
  }, [expiry]);

  return <>{clientTime}</>;
};

export const ClientTime = React.memo(ClientTimeBase);
