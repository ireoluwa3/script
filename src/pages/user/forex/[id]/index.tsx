import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import $fetch from "@/utils/api";

const ForexAccountView = () => {
  const router = useRouter();
  const { id } = router.query;

  const [account, setAccount] = useState<ForexAccount | null>(null);
  const [windowSize, setWindowSize] = useState({
    width: process.browser ? window.innerWidth : 0,
    height: process.browser ? window.innerHeight : 0,
  });

  const fetchForexAccount = async () => {
    const { data, error } = await $fetch({
      url: `/api/ext/forex/account/${id}`,
      silent: true,
    });

    if (!error) {
      setAccount(data);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    if (id) {
      fetchForexAccount();
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [id]);

  return (
    <div>
      {account && (
        <iframe
          key={account.accountId}
          src={`https://metatraderweb.app/trade?servers=${
            account.broker
          }&trade_server=${account.broker}&startup_mode=${
            account.type === "DEMO" ? "open_demo" : "open_trade"
          }&startup_version=${account.mt}&lang=EN&save_password=on&login=${
            account.accountId
          }&password=${account.password}&leverage=${account.leverage}`}
          allowFullScreen
          style={{
            height: `calc(${windowSize.height}px - 96px)`,
            width: "100%",
          }}
        />
      )}
    </div>
  );
};

export default ForexAccountView;
