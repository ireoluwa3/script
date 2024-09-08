import Layout from "@/layouts/Default";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import $fetch from "@/utils/api";
import { useTranslation } from "next-i18next";
import { ObjectTable } from "@/components/elements/base/object-table";
import Button from "@/components/elements/base/button/Button";
import Modal from "@/components/elements/base/modal/Modal";
import Card from "@/components/elements/base/card/Card";
import IconButton from "@/components/elements/base/button-icon/IconButton";
import { Icon } from "@iconify/react";
const apiListBackups = "/api/admin/system/database/backup";
const apiBackup = "/api/admin/system/database/backup";
const apiRestore = "/api/admin/system/database/restore";
interface Backup {
  filename: string;
  path: string;
  createdAt: string;
}
const DatabaseBackupDashboard: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [backups, setBackups] = useState<Backup[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [restoreFile, setRestoreFile] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fetchBackups = async () => {
    const { data, error } = await $fetch({
      url: apiListBackups,
      silent: true,
    });
    if (!error) {
      setBackups(data);
    }
  };
  const initiateBackup = async () => {
    setIsLoading(true);
    const { error } = await $fetch({
      url: apiBackup,
      method: "POST",
    });
    if (!error) {
      fetchBackups();
      setIsModalOpen(false);
    }
    setIsLoading(false);
  };
  const restoreBackup = async (filename: string) => {
    setIsLoading(true);
    const { error } = await $fetch({
      url: apiRestore,
      method: "POST",
      body: { backupFile: filename },
    });
    if (!error) {
      fetchBackups();
      setRestoreFile(null);
    }
    setIsLoading(false);
  };
  useEffect(() => {
    if (router.isReady) {
      fetchBackups();
    }
  }, [router.isReady]);
  const columnConfig: ColumnConfigType[] = [
    {
      field: "filename",
      label: "Filename",
      type: "string",
      sortable: true,
    },
    {
      field: "path",
      label: "Path",
      type: "string",
      sortable: true,
    },
    {
      field: "createdAt",
      label: "Created At",
      type: "date",
      sortable: true,
    },
    {
      field: "actions",
      label: "Actions",
      type: "actions",
      sortable: false,
      actions: [
        {
          icon: "mdi:restore",
          color: "primary",
          onClick: (row) => {
            setRestoreFile(row.filename);
          },
          size: "sm",
          tooltip: "Restore Backup",
        },
      ],
    },
  ];
  return (
    <Layout title={t("Database Backups")} color="muted">
      <ObjectTable
        title={t("Database Backups")}
        items={backups}
        setItems={setBackups}
        columnConfig={columnConfig}
        navSlot={
          <>
            <Button
              color="primary"
              onClick={() => setIsModalOpen(true)}
              className="ml-2"
              shape={"rounded"}
              variant={"outlined"}
            >
              {t("Create Backup")}
            </Button>
          </>
        }
        shape="rounded"
        size="sm"
        initialPerPage={20}
      />
      <Modal open={isModalOpen} size="sm">
        <Card shape="smooth">
          <div className="flex items-center justify-between p-4 md:p-6">
            <p className="font-sans text-lg font-medium text-muted-900 dark:text-white">
              {t("Confirm Backup")}
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
              {t("Are you sure you want to create a new backup?")}
            </p>
          </div>
          <div className="p-4 md:p-6">
            <div className="flex gap-x-2 justify-end">
              <Button
                color="primary"
                onClick={initiateBackup}
                disabled={isLoading}
                loading={isLoading}
              >
                {t("Confirm")}
              </Button>
            </div>
          </div>
        </Card>
      </Modal>

      {restoreFile && (
        <Modal open={Boolean(restoreFile)} size="sm">
          <Card shape="smooth">
            <div className="flex items-center justify-between p-4 md:p-6">
              <p className="font-sans text-lg font-medium text-muted-900 dark:text-white">
                {t("Confirm Restore")}
              </p>

              <IconButton
                size="sm"
                shape="full"
                onClick={() => setRestoreFile(null)}
              >
                <Icon icon="lucide:x" className="h-4 w-4" />
              </IconButton>
            </div>
            <div className="p-4 md:p-6">
              <p className="text-muted-400 dark:text-muted-600 text-sm mb-4">
                {t(
                  `Are you sure you want to restore the backup "${restoreFile}"?`
                )}
              </p>
            </div>
            <div className="p-4 md:p-6">
              <div className="flex gap-x-2 justify-end">
                <Button
                  color="primary"
                  onClick={() => restoreBackup(restoreFile)}
                  disabled={isLoading}
                  loading={isLoading}
                >
                  {t("Confirm")}
                </Button>
              </div>
            </div>
          </Card>
        </Modal>
      )}
    </Layout>
  );
};
export default DatabaseBackupDashboard;
export const permission = "Access Database Backup Management";
