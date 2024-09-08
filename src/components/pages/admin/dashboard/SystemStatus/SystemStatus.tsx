import React, { useEffect } from "react";
import $fetch from "@/utils/api";
import Alert from "@/components/elements/base/alert/Alert";
import "react-loading-skeleton/dist/skeleton.css";
import { StatusProps } from "./SystemStatus.types";

const statusMap = {
  Up: { icon: "ph:check-circle-duotone", color: "success" },
  Down: { icon: "ph:warning-octagon-duotone", color: "danger" },
};

const categories = [
  {
    category: "Core Services",
    services: [
      { service: "email", label: "Email" },
      { service: "sms", label: "SMS" },
      { service: "scylla", label: "Scylla Client" },
      { service: "googletranslate", label: "Google Translate" },
    ],
  },
  {
    category: "Financial Services",
    services: [
      { service: "openexchangerates", label: "Open Exchange Rates" },
      { service: "stripe", label: "Stripe" },
    ],
  },
  {
    category: "Ecosystem Nodes",
    services: [
      { service: "ethereum", label: "Ethereum Node" },
      { service: "bsc", label: "Binance Smart Chain Node" },
      { service: "polygon", label: "Polygon Node" },
      { service: "ftm", label: "Fantom Node" },
      { service: "optimism", label: "Optimism Node" },
      { service: "arbitrum", label: "Arbitrum Node" },
      { service: "celo", label: "Celo Node" },
    ],
  },
];

const SystemStatusBase = () => {
  const [pendingServices, setPendingServices] = React.useState(
    categories.flatMap((cat) => cat.services)
  );
  const [processedServices, setProcessedServices] = React.useState(
    new Set<string>()
  );
  const [data, setData] = React.useState<StatusProps["data"]>({});

  useEffect(() => {
    const fetchData = async () => {
      if (pendingServices.length === 0) return;

      const currentService = pendingServices[0];

      if (processedServices.has(currentService.service)) {
        setPendingServices((prevServices) => prevServices.slice(1));
        return;
      }

      setData((prevData) => ({
        ...prevData,
        [currentService.service]: {
          service: currentService.service,
          label: currentService.label,
          status: "Loading",
          message: "",
          timestamp: "",
        },
      }));

      const { data, error } = await $fetch({
        url: "/api/admin/system/health",
        params: { service: currentService.service },
        silent: true,
      });

      if (!error) {
        setData((prevData) => ({
          ...prevData,
          [currentService.service]: {
            ...prevData[currentService.service],
            ...data[currentService.service],
          },
        }));
      }

      setProcessedServices(
        (prevProcessed) => new Set([...prevProcessed, currentService.service])
      );
    };

    fetchData();
  }, [pendingServices, processedServices]);

  return (
    <>
      <div className="space-y-8 mt-8">
        {categories.map((category) => (
          <div key={category.category}>
            <div className="relative mb-8">
              <hr className="border-muted-200 dark:border-muted-700" />
              <span className="absolute inset-0 -top-2.5 text-center font-semibold text-sm text-muted-500 dark:text-muted-400">
                <span className="bg-muted-50 dark:bg-muted-900 px-2">
                  {category.category}
                </span>
              </span>
            </div>
            {category.services.map((service) => {
              const status = data[service.service];
              return (
                <Alert
                  key={service.service}
                  icon={
                    statusMap[status?.status]?.icon || "mingcute:loading-3-line"
                  }
                  iconClassName={
                    statusMap[status?.status]?.icon ? "" : "animate-spin"
                  }
                  color={statusMap[status?.status]?.color || "muted"}
                  label={
                    <div className="w-full flex items-center justify-between gap-2 pe-5">
                      <span>{service.label}</span>
                      <span>{status?.timestamp}</span>
                    </div>
                  }
                  sublabel={
                    status?.message
                      ? status.message
                      : `Checking ${service.label} status...`
                  }
                  canClose={false}
                  className="my-3"
                />
              );
            })}
          </div>
        ))}
      </div>
    </>
  );
};

export const SystemStatus = SystemStatusBase;
