import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import Layout from "@/layouts/Default";
import { useRouter } from "next/router";
import $fetch from "@/utils/api";
import { BackButton } from "@/components/elements/base/button/BackButton";
import Button from "@/components/elements/base/button/Button";
import Card from "@/components/elements/base/card/Card";
import IconBox from "@/components/elements/base/iconbox/IconBox";
import Modal from "@/components/elements/base/modal/Modal";
import InfoBlock from "@/components/elements/base/infoBlock";
import Avatar from "@/components/elements/base/avatar/Avatar";
import Checkbox from "@/components/elements/form/checkbox/Checkbox";
import IconButton from "@/components/elements/base/button-icon/IconButton";
import Input from "@/components/elements/form/input/Input";
import Pagination from "@/components/elements/base/pagination/Pagination";
import { DealCard } from "@/components/pages/p2p/DealCard";
import { ObjectTable } from "@/components/elements/base/object-table/ObjectTable";
import Tag from "@/components/elements/base/tag/Tag";
import { useTranslation } from "next-i18next";
const CampaignStatus = {
  PENDING: "warning",
  ACTIVE: "primary",
  PAUSED: "info",
  COMPLETED: "success",
  CANCELLED: "danger",
  STOPPED: "danger",
};
const statusText = (status) => {
  const texts = {
    PENDING: "Pending",
    ACTIVE: "Active",
    PAUSED: "Paused",
    COMPLETED: "Completed",
    CANCELLED: "Canceled",
    STOPPED: "Stopped",
  };
  return texts[status] || "Pending";
};
type Target = {
  id: string;
  avatar: string;
  email: string;
  firstName: string;
  lastName: string;
  status: string;
};
const targetsColumnConfig: ColumnConfigType[] = [
  {
    field: "email",
    label: "Email",
    type: "text",
    sortable: true,
    getValue: (row) => (
      <div className="flex items-center gap-2">
        <Avatar
          size="xs"
          src={row.avatar || "/img/avatars/placeholder.webp"}
          className="dark:invert"
        />
        <div className="flex flex-col">
          <span className="text-md">{row.email}</span>
          <span className="text-sm text-muted-500 dark:text-muted-400">
            {row.firstName} {row.lastName}
          </span>
        </div>
      </div>
    ),
  },
  {
    field: "status",
    label: "Status",
    type: "text",
    sortable: true,
    getValue: (row) => (
      <Tag color={CampaignStatus[row.status]} variant={"pastel"}>
        {statusText(row.status)}
      </Tag>
    ),
  },
];
const CampaignDetails = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = router.query;
  const [campaign, setCampaign] = useState<any>(null);
  const [items, setItems] = useState<Target[]>([]);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<Target[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<Target[]>([]);
  const [userFilter, setUserSearch] = useState("");
  const [userPagination, setUserPagination] = useState({
    totalItems: 0,
    totalPages: 0,
    perPage: 20,
    currentPage: 1,
  });
  const fetchCampaign = async () => {
    const { data, error } = await $fetch({
      url: `/api/admin/ext/mailwizard/campaign/${id}`,
      silent: true,
    });
    if (!error) {
      setCampaign(data);
      let targets = [];
      try {
        targets = JSON.parse(data.targets);
      } catch (error) {
        targets = [];
      }
      if (targets) {
        setItems(targets);
      }
    }
  };
  useEffect(() => {
    if (id) {
      fetchCampaign();
    }
  }, [id]);
  const updateCampaignStatus = async (status) => {
    const { error } = await $fetch({
      url: `/api/admin/ext/mailwizard/campaign/${id}/status`,
      method: "PUT",
      body: { status },
    });
    if (!error) {
      await fetchCampaign();
    }
  };
  const handleUpdateStatus = (status) => {
    updateCampaignStatus(status);
  };
  const fetchUsers = async (filter = "", page = 1, perPage = 10) => {
    const filterObject = {
      firstName: { value: filter, operator: "startsWith" },
    };
    const { data, error } = await $fetch({
      url: `/api/admin/crm/user`,
      params: { filter: JSON.stringify(filterObject), page, perPage },
      silent: true,
    });
    if (!error) {
      setUsers(data.items);
      setUserPagination(data.pagination);
    }
  };
  useEffect(() => {
    if (open) {
      fetchUsers(
        userFilter,
        userPagination.currentPage,
        userPagination.perPage
      );
    }
  }, [userFilter, userPagination.currentPage, userPagination.perPage, open]);
  useEffect(() => {
    if (campaign && campaign.targets && open) {
      const existingTargetIds = items.map((item) => item.id);
      setSelectedUsers(
        users.filter((user) => existingTargetIds.includes(user.id))
      );
    }
  }, [campaign, items, users, open]);
  const handleSelectUser = (user) => {
    setSelectedUsers((prev) => {
      if (prev.some((u) => u.id === user.id)) {
        return prev.filter((u) => u.id !== user.id);
      } else {
        return [...prev, user];
      }
    });
  };
  const handleAddUsers = async () => {
    if (selectedUsers.length === items.length) {
      setOpen(false);
      return;
    }
    setIsLoading(true);
    let targets: Target[] = [];
    try {
      targets = JSON.parse(campaign.targets) || [];
    } catch (error) {
      targets = [];
    }
    const targetMap: Map<string, Target> = new Map(
      targets.map((target) => [target.id, target])
    );
    selectedUsers.forEach((user) => {
      if (targetMap.has(user.id)) {
        // Preserve existing status
        const existingTarget = targetMap.get(user.id)!;
        targetMap.set(user.id, {
          ...existingTarget,
          avatar: user.avatar,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        });
      } else {
        // Add new user with status "PENDING"
        targetMap.set(user.id, {
          id: user.id,
          avatar: user.avatar,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          status: "PENDING",
        });
      }
    });
    const updatedTargets = Array.from(targetMap.values()).filter((target) =>
      selectedUsers.some((user) => user.id === target.id)
    );
    const { error } = await $fetch({
      url: `/api/admin/ext/mailwizard/campaign/${id}/target`,
      method: "PUT",
      body: {
        targets: JSON.stringify(updatedTargets),
      },
    });
    if (!error) {
      setOpen(false);
      setItems(updatedTargets);
    }
    setIsLoading(false);
  };
  if (!campaign) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center space-y-4">
          <Icon
            icon="mdi:loading"
            className="h-12 w-12 animate-spin text-primary-500"
          />
          <p className="text-xl text-primary-500">{t("Loading Campaign...")}</p>
        </div>
      </div>
    );
  }
  return (
    <Layout title={t("View Mailwizard Campaign")} color="muted">
      <div className="flex justify-between items-center mb-4">
        <h2>
          {campaign.name}
          {t("Campaign")}
        </h2>
        <BackButton href="/admin/ext/mailwizard/campaign" />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        <div className="col-span-1">
          <Card className="p-3 mb-5">
            <div className="flex items-center justify-between gap-3 flex-col">
              <div className="flex items-center gap-3 w-full">
                <div className="w-full">
                  <Button
                    type="button"
                    color="success"
                    className="w-full"
                    onClick={() => handleUpdateStatus("ACTIVE")}
                    disabled={["ACTIVE", "COMPLETED", "CANCELLED"].includes(
                      campaign.status
                    )}
                  >
                    <Icon icon="line-md:play" className="h-4 w-4 mr-2" />
                    {t("Start")}
                  </Button>
                </div>
                <div className="w-full">
                  <Button
                    type="button"
                    color="warning"
                    className="w-full"
                    onClick={() => handleUpdateStatus("PAUSED")}
                    disabled={[
                      "PENDING",
                      "STOPPED",
                      "PAUSED",
                      "COMPLETED",
                      "CANCELLED",
                    ].includes(campaign.status)}
                  >
                    <Icon icon="line-md:pause" className="h-4 w-4 mr-2" />
                    {t("Pause")}
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-3 w-full">
                <div className="w-full">
                  <Button
                    type="button"
                    color="danger"
                    className="w-full"
                    onClick={() => handleUpdateStatus("STOPPED")}
                    disabled={[
                      "PENDING",
                      "COMPLETED",
                      "CANCELLED",
                      "STOPPED",
                    ].includes(campaign.status)}
                  >
                    <Icon icon="mdi:stop" className="h-4 w-4 mr-2" />
                    {t("Stop")}
                  </Button>
                </div>
                <div className="w-full">
                  <Button
                    type="button"
                    color="danger"
                    className="w-full"
                    onClick={() => handleUpdateStatus("CANCELLED")}
                    disabled={[
                      "ACTIVE",
                      "PAUSED",
                      "COMPLETED",
                      "CANCELLED",
                    ].includes(campaign.status)}
                  >
                    <Icon icon="line-md:close" className="h-4 w-4 mr-2" />
                    {t("Cancel")}
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          <DealCard isToggle title={t("Campaign Details")}>
            <InfoBlock
              icon="bx:bx-tag"
              label={t("Name")}
              value={campaign.name}
            />
            <InfoBlock
              icon="bx:bx-envelope"
              label={t("Subject")}
              value={campaign.subject}
            />
            <InfoBlock
              icon="bx:bx-tachometer"
              label={t("Speed")}
              value={campaign.speed}
            />
            <InfoBlock
              icon="bx:bx-template"
              label={t("Template")}
              value={campaign.template.name}
            />
            <InfoBlock
              icon="bx:bx-info-circle"
              label={t("Status")}
              value={
                <span className={`text-${CampaignStatus[campaign.status]}-500`}>
                  {statusText(campaign.status)}
                </span>
              }
            />
            <InfoBlock
              icon="bx:bx-calendar"
              label={t("Created At")}
              value={new Date(campaign.createdAt).toLocaleDateString()}
            />
          </DealCard>
        </div>

        <div className="col-span-1 md:col-span-2 lg:col-span-3">
          <ObjectTable
            title={t("Targets")}
            items={items}
            setItems={setItems}
            columnConfig={targetsColumnConfig}
            navSlot={
              <IconBox
                color="primary"
                onClick={() => setOpen(true)}
                size={"sm"}
                shape={"rounded"}
                variant={"pastel"}
                className="cursor-pointer hover:shadow transition-all duration-300 ease-in-out hover:shadow-muted-300/30 dark:hover:shadow-muted-800/20 hover:bg-primary-500 hover:text-muted-100"
                icon="mdi:plus"
              />
            }
            shape="rounded"
            size="sm"
            filterField="email"
          />
        </div>
      </div>

      <Modal open={open} size="lg">
        <Card shape="smooth">
          <div className="flex items-center justify-between p-4 md:p-6">
            <p className="font-sans text-lg font-medium text-muted-900 dark:text-white">
              {t("Target Selection")}
            </p>
            <IconButton size="sm" shape="full" onClick={() => setOpen(false)}>
              <Icon icon="lucide:x" className="h-4 w-4" />
            </IconButton>
          </div>
          <div className="p-4 md:px-6 md:py-8">
            <div className="mx-auto w-full">
              <p className="text-sm text-muted-500 dark:text-muted-400">
                {t("Add new target to the campaign")}
              </p>

              <Input
                value={userFilter}
                onChange={(e) => setUserSearch(e.target.value)}
                icon="lucide:search"
                color="contrast"
                placeholder={t("Search users...")}
              />
              <div className="mt-4 max-h-[200px] overflow-y-auto mb-5 rounded-lg bg-white dark:bg-muted-950 border border-muted-200 dark:border-muted-800">
                {users.length > 0 ? (
                  users.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center gap-2 py-2 px-4"
                    >
                      <div className="me-2 flex items-center">
                        <Checkbox
                          color="primary"
                          checked={selectedUsers.some(
                            (selectedUser) => selectedUser.id === user.id
                          )}
                          onChange={() => handleSelectUser(user)}
                        />
                      </div>
                      <Avatar
                        size="xxs"
                        src={user.avatar || "/img/avatars/placeholder.webp"}
                        className="dark:invert"
                      />
                      <div className=" text-muted-700 dark:text-muted-200 flex flex-col">
                        <span className="text-md">
                          {user.firstName} {user.lastName}
                        </span>
                        <span className="text-sm">{user.email}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-4 text-center">
                    <Icon
                      icon="arcticons:samsung-finder"
                      className="mx-auto h-20 w-20 text-muted-400"
                    />
                    <h3 className="mb-2 font-sans text-xl text-muted-700 dark:text-muted-200">
                      {t("Nothing found")}
                    </h3>
                    <p className="mx-auto max-w-[280px] font-sans text-md text-muted-400">
                      {t(
                        "Sorry, looks like we couldn't find any matching records. Try different search terms."
                      )}
                    </p>
                  </div>
                )}
              </div>
              <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4 p-2 rounded-lg bg-muted-50 dark:bg-muted-900 border border-muted-200 dark:border-muted-800">
                <Pagination
                  buttonSize={"md"}
                  currentPage={userPagination.currentPage}
                  totalCount={userPagination.totalItems}
                  pageSize={userPagination.perPage}
                  onPageChange={(page) =>
                    setUserPagination({ ...userPagination, currentPage: page })
                  }
                />
              </div>
            </div>
          </div>
          <div className="p-4 md:p-6">
            <div className="flex w-full justify-between gap-2">
              <p className="mt-2 text-md font-medium text-muted-700 dark:text-muted-200">
                {t("Selected Targets")}{" "}
                {selectedUsers.length}
              </p>
              <Button
                variant="solid"
                color="primary"
                shape="smooth"
                loading={isLoading}
                disabled={isLoading}
                onClick={handleAddUsers}
              >
                {t("Add")}
              </Button>
            </div>
          </div>
        </Card>
      </Modal>
    </Layout>
  );
};
export default CampaignDetails;
export const permission = "Access Mailwizard Campaign Management";
