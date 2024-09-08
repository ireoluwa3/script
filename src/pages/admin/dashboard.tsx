import React, { useState } from "react";
import Layout from "@/layouts/Default";
import { DataTable } from "@/components/elements/base/datatable";
import { SystemStatus } from "@/components/pages/admin/dashboard/SystemStatus";
import { useTranslation } from "next-i18next";

const columnConfig: ColumnConfigType[] = [
  {
    field: "title",
    label: "Title",
    sublabel: "createdAt",
    type: "text",
    sortable: true,
  },
  {
    field: "message",
    label: "Message",
    sublabel: "link",
    type: "text",
    sortable: false,
  },
  {
    field: "type",
    label: "Type",
    type: "select",
    sortable: true,
    options: [
      { value: "SECURITY", label: "Security", color: "danger" },
      { value: "SYSTEM", label: "System", color: "warning" },
      { value: "ACTIVITY", label: "Activity", color: "info" },
    ],
  },
];

const TabButton = ({ label, activeTab, setActiveTab, tabKey }) => {
  const { t } = useTranslation();
  const isActive = activeTab === tabKey;
  return (
    <button
      type="button"
      aria-label={t(label)}
      className={`shrink-0 border-b-2 px-6 pb-4 text-sm transition-colors duration-300
                  ${
                    isActive
                      ? "border-primary-500 text-primary-500 dark:text-primary-400 dark:border-primary-400"
                      : "border-transparent text-muted"
                  }
                `}
      onClick={() => setActiveTab(tabKey)}
    >
      <span>{t(label)}</span>
    </button>
  );
};

const NotificationsTab = () => {
  const { t } = useTranslation();
  return (
    <div className="mt-8">
      <DataTable
        title={t("Notifications")}
        endpoint="/api/user/notification"
        columnConfig={columnConfig}
        hasStructure={false}
        formSize="sm"
        isParanoid={false}
        canCreate={false}
        canEdit={false}
        canDelete
        hasTitle={false}
        canView={false}
      />
    </div>
  );
};

const AdminDashboard = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("Notifications");

  return (
    <Layout title={t("Feed")} color="muted">
      <div className="w-full md:w-auto flex gap-4 border-b border-muted-200 dark:border-muted-800 overflow-x-auto">
        <TabButton
          label="System Status"
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tabKey="SystemStatus"
        />
        <TabButton
          label="Notifications"
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tabKey="Notifications"
        />
      </div>
      {activeTab === "SystemStatus" && <SystemStatus />}
      {activeTab === "Notifications" && <NotificationsTab />}
    </Layout>
  );
};

export default AdminDashboard;
export const permission = "Access Admin Dashboard";
