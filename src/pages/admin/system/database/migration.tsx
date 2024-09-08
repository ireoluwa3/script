import Layout from "@/layouts/Default";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import $fetch from "@/utils/api";
import { useTranslation } from "next-i18next";
import Button from "@/components/elements/base/button/Button";
import Modal from "@/components/elements/base/modal/Modal";
import Card from "@/components/elements/base/card/Card";
import IconButton from "@/components/elements/base/button-icon/IconButton";
import { Icon } from "@iconify/react";
import WebSocketManager from "@/utils/ws";
const apiMigrate = "/api/admin/system/database/migrate";
const DatabaseMigrationDashboard: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);
  const logRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (router.isReady) {
      const wsManager = new WebSocketManager(
        "/api/admin/system/database/migrate"
      );
      wsManager.connect();
      wsManager.on("open", () => {
        wsManager.send({ action: "SUBSCRIBE", payload: {} });
      });
      wsManager.on("message", (message: any) => {
        const newLog = {
          message: `[${new Date().toLocaleTimeString()}] ${message.message}`,
          status: message.status,
        };
        setLogs((prevLogs) => [...prevLogs, newLog]);
      });
      return () => {
        wsManager.disconnect();
      };
    }
  }, [router.isReady]);
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logs]);
  const initiateMigration = async () => {
    setIsModalOpen(false);
    setIsLoading(true);
    await $fetch({
      url: apiMigrate,
      method: "POST",
    });
    setIsLoading(false);
  };
  const renderLogs = () => {
    return logs.map((log, index) => {
      const logClass =
        typeof log.status !== "undefined" && log.status === true
          ? "text-success-500"
          : typeof log.status !== "undefined" && log.status === false
          ? "text-danger-500"
          : "text-muted-800";
      return (
        <div key={index} className={`${logClass} whitespace-nowrap`}>
          {log.message}
        </div>
      );
    });
  };
  return (
    <Layout title={t("Database Migration")} color="muted">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-medium text-muted-900 dark:text-white">
          {t("Database Migration")}
        </h1>
        <Button
          color="primary"
          onClick={() => setIsModalOpen(true)}
          className="ml-2"
          shape={"rounded"}
          variant={"outlined"}
          animated={false}
        >
          {t("Start Migration")}
        </Button>
      </div>

      <Modal open={isModalOpen} size="sm">
        <Card shape="smooth">
          <div className="flex items-center justify-between p-4 md:p-6">
            <p className="font-sans text-lg font-medium text-muted-900 dark:text-white">
              {t("Confirm Migration")}
            </p>

            <IconButton
              size="sm"
              shape="full"
              onClick={() => setIsModalOpen(false)}
            >
              <Icon icon="lucide:x" className="h-4 w-4" />
            </IconButton>
          </div>
          <div className="p-4 md:p-6">
            <p className="text-muted-400 dark:text-muted-600 text-sm mb-4">
              {t("Are you sure you want to start the migration?")}
            </p>
          </div>
          <div className="p-4 md:p-6">
            <div className="flex gap-x-2 justify-end">
              <Button
                color="primary"
                onClick={initiateMigration}
                disabled={isLoading}
                loading={isLoading}
              >
                {t("Confirm")}
              </Button>
            </div>
          </div>
        </Card>
      </Modal>

      <div
        className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded shadow overflow-auto text-sm slimscroll h-[calc(100vh-200px)]"
        ref={logRef}
      >
        {renderLogs()}
      </div>
    </Layout>
  );
};
export default DatabaseMigrationDashboard;
export const permission = "Access Database Migration Management";
