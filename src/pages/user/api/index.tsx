import Layout from "@/layouts/Default";
import React, { useEffect, useState } from "react";
import { useDashboardStore } from "@/stores/dashboard";
import $fetch from "@/utils/api";
import Button from "@/components/elements/base/button/Button";
import Card from "@/components/elements/base/card/Card";
import { Icon } from "@iconify/react";
import { useTranslation } from "next-i18next";
import { toast } from "sonner";
import Input from "@/components/elements/form/input/Input";
import Checkbox from "@/components/elements/form/checkbox/Checkbox";
import Modal from "@/components/elements/base/modal/Modal";
import IconButton from "@/components/elements/base/button-icon/IconButton";
import Radio from "@/components/elements/form/radio/Radio";

const ApiKeyManagement = () => {
  const { t } = useTranslation();
  const { profile } = useDashboardStore();
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [permissions, setPermissions] = useState<string[]>([]);
  const [ipWhitelist, setIpWhitelist] = useState<string[]>([]);
  const [ipInput, setIpInput] = useState("");
  const [ipRestriction, setIpRestriction] = useState("restricted");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showFullKey, setShowFullKey] = useState<string | null>(null);

  const permissionOptions = [
    {
      label: t("Trade"),
      value: "trade",
      description: t("Allows placing orders and trading on the exchange."),
    },
    {
      label: t("Futures"),
      value: "futures",
      description: t("Allows trading in futures markets."),
    },
    {
      label: t("Deposit"),
      value: "deposit",
      description: t("Allows viewing deposit addresses and history."),
    },
    {
      label: t("Withdraw"),
      value: "withdraw",
      description: t("Allows withdrawals from the account."),
    },
    {
      label: t("Transfer"),
      value: "transfer",
      description: t("Allows transfers between your accounts."),
    },
  ];

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    setLoading(true);
    const { data, error } = await $fetch({
      url: "/api/api-key",
      silent: true,
    });
    if (!error) {
      setApiKeys(data);
    } else {
      toast.error(t("Failed to fetch API keys"));
    }
    setLoading(false);
  };

  const createApiKey = async () => {
    setCreating(true);
    const { data, error } = await $fetch({
      url: "/api/api-key",
      method: "POST",
      body: {
        name: newKeyName,
        permissions,
        ipWhitelist: ipRestriction === "restricted" ? ipWhitelist : [],
      },
    });
    if (!error) {
      setApiKeys([...apiKeys, data]);
      setNewKeyName("");
      setPermissions([]);
      setIpWhitelist([]);
      setIpInput("");
      setIpRestriction("restricted");
      setShowFullKey(data.id);
      toast.success(t("API key created successfully"));
      setIsCreating(false);
    } else {
      toast.error(t("Failed to create API key"));
    }
    setCreating(false);
  };

  const deleteApiKey = async (id: string) => {
    const { error } = await $fetch({
      url: `/api/api-key/${id}`,
      method: "DELETE",
    });
    if (!error) {
      setApiKeys(apiKeys.filter((key) => key.id !== id));
      toast.success(t("API key deleted successfully"));
    } else {
      toast.error(t("Failed to delete API key"));
    }
  };

  const handleEdit = (id: string) => {
    const keyToEdit = apiKeys.find((key) => key.id === id);
    if (keyToEdit) {
      setIsEditing(id);
      setNewKeyName(keyToEdit.name); // Display the key name, but keep it non-editable
      setPermissions(keyToEdit.permissions || []); // Populate permissions
      setIpWhitelist(
        Array.isArray(keyToEdit.ipWhitelist) ? keyToEdit.ipWhitelist : []
      ); // Ensure ipWhitelist is an array
      setIpRestriction(
        keyToEdit.ipWhitelist && keyToEdit.ipWhitelist.length > 0
          ? "restricted"
          : "unrestricted"
      );
    }
  };

  const updateApiKey = async () => {
    const { error } = await $fetch({
      url: `/api/api-key/${isEditing}`,
      method: "PUT",
      body: {
        permissions,
        ipWhitelist: ipRestriction === "restricted" ? ipWhitelist : [],
      },
    });
    if (!error) {
      toast.success(t("API key updated successfully"));
      setIsEditing(null);
      fetchApiKeys();
    } else {
      toast.error(t("Failed to update API key"));
    }
  };

  const addIpToWhitelist = () => {
    if (ipInput && !ipWhitelist.includes(ipInput)) {
      setIpWhitelist([...ipWhitelist, ipInput]);
      setIpInput("");
    } else {
      toast.error(t("IP address is already in the whitelist or invalid."));
    }
  };

  const removeIpFromWhitelist = (ip: string) => {
    setIpWhitelist(ipWhitelist.filter((item) => item !== ip));
  };

  const maskApiKey = (key: string) => {
    return `**** **** **** ${key.slice(-5)}`;
  };

  const handlePermissionToggle = (permission: string) => {
    setPermissions((prevPermissions) => {
      let parsedPermissions = prevPermissions;

      // Handle possible string or object cases
      if (typeof prevPermissions === "string") {
        try {
          parsedPermissions = JSON.parse(prevPermissions);
        } catch (e) {
          parsedPermissions = [];
        }
      }

      if (!Array.isArray(parsedPermissions)) {
        parsedPermissions = [];
      }

      // Toggle permission
      const updatedPermissions = parsedPermissions.includes(permission)
        ? parsedPermissions.filter((p) => p !== permission)
        : [...parsedPermissions, permission];

      return updatedPermissions;
    });
  };

  return (
    <Layout title={t("API Key Management")}>
      <div className="flex flex-col gap-8 p-4 sm:p-6 lg:p-8">
        <Card className="p-6 dark:bg-muted-900">
          <h2 className="text-lg font-semibold mb-4 dark:text-muted-100">
            {t("API Key Management")}
          </h2>
          <p className="dark:text-muted-400">
            {t("1. Each account can create up to 10 API Keys.")}
          </p>
          <p className="dark:text-muted-400">
            {t("2. Do not disclose your API Key.")}
          </p>
          <p className="dark:text-muted-400">
            {t(
              "3. Restrict access to trusted IPs only for increased security."
            )}
          </p>
          <p className="dark:text-muted-400">
            {t("4. Complete KYC to create an API key.")}
          </p>
          <div className="mt-6">
            <Button onClick={() => setIsCreating(true)} color="primary">
              {t("Create API Key")}
            </Button>
          </div>
        </Card>

        {loading ? (
          <div className="flex justify-center items-center">
            <Icon
              icon="mdi:loading"
              className="animate-spin h-8 w-8 dark:text-white"
            />
          </div>
        ) : apiKeys.length > 0 ? (
          <div className="flex flex-col gap-5">
            {apiKeys.map((key) => (
              <Card key={key.id} className="p-6 dark:bg-muted-900">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div className="flex-1">
                    <h4 className="text-md font-semibold dark:text-muted-100">
                      {key.name}
                    </h4>
                    <p className="text-sm text-muted-600 dark:text-muted-400">
                      {showFullKey === key.id ? key.key : maskApiKey(key.key)}
                    </p>
                  </div>
                  <div className="flex gap-3 mt-4 sm:mt-0">
                    <Button onClick={() => handleEdit(key.id)}>
                      {isEditing === key.id ? t("Close") : t("Edit")}
                    </Button>
                    <Button color="danger" onClick={() => deleteApiKey(key.id)}>
                      {t("Delete")}
                    </Button>
                  </div>
                </div>
                {isEditing === key.id && (
                  <div className="mt-4">
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      {permissionOptions.map((perm) => (
                        <div
                          key={perm.value}
                          className="flex items-center gap-2"
                        >
                          <Checkbox
                            id={perm.value}
                            checked={permissions.includes(perm.value)}
                            onChange={() => handlePermissionToggle(perm.value)}
                          />
                          <div>
                            <label
                              htmlFor={perm.value}
                              className="cursor-pointer dark:text-white text-md"
                            >
                              {perm.label}
                            </label>
                            <small className="block text-muted-500 dark:text-muted-400 text-sm">
                              {perm.description}
                            </small>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4">
                      <h4 className="text-md font-semibold dark:text-muted-100 mb-2">
                        {t("IP Access Restrictions")}
                      </h4>
                      <div className="flex items-center gap-2 mb-4">
                        <Radio
                          type="radio"
                          id="unrestricted"
                          name="ipRestriction"
                          value="unrestricted"
                          label={t("Unrestricted (Less Secure)")}
                          checked={ipRestriction === "unrestricted"}
                          onChange={() => setIpRestriction("unrestricted")}
                        />
                        <p className="text-xs text-red-500 dark:text-red-400">
                          {t(
                            "This API Key allows access from any IP address. This is not recommended."
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Radio
                          type="radio"
                          id="restricted"
                          name="ipRestriction"
                          value="restricted"
                          label={t(
                            "Restrict access to trusted IPs only (Recommended)"
                          )}
                          checked={ipRestriction === "restricted"}
                          onChange={() => setIpRestriction("restricted")}
                        />
                      </div>
                      {ipRestriction === "restricted" && (
                        <>
                          <Input
                            placeholder={t("Enter IP to Whitelist")}
                            value={ipInput}
                            onChange={(e) => setIpInput(e.target.value)}
                            className="dark:bg-muted-800 dark:text-white mt-2"
                            onKeyPress={(e) => {
                              if (e.key === "Enter") addIpToWhitelist();
                            }}
                          />
                          <Button
                            onClick={addIpToWhitelist}
                            className="mt-2"
                            disabled={!ipInput.trim()}
                          >
                            {t("Add IP")}
                          </Button>
                          <div className="mt-2">
                            {Array.isArray(ipWhitelist) &&
                              ipWhitelist.map((ip, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-2 mt-1"
                                >
                                  <span className="dark:text-white">{ip}</span>
                                  <IconButton
                                    size="sm"
                                    onClick={() => removeIpFromWhitelist(ip)}
                                  >
                                    <Icon
                                      icon="mdi:close"
                                      className="h-4 w-4 dark:text-white"
                                    />
                                  </IconButton>
                                </div>
                              ))}
                          </div>
                        </>
                      )}
                    </div>

                    <div className="mt-4 flex justify-end gap-3">
                      <Button
                        onClick={() => setIsEditing(null)} // Close edit mode
                      >
                        {t("Cancel")}
                      </Button>
                      <Button onClick={updateApiKey} color="primary">
                        {t("Save")}
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center text-muted-600 dark:text-muted-400">
            {t("No API keys found. Create a new one to get started.")}
          </div>
        )}

        <Modal open={isCreating} size="xl">
          <Card shape="smooth" className="dark:bg-muted-900">
            <div className="flex items-center justify-between p-4 md:p-6">
              <p className="font-sans text-lg font-medium text-muted-900 dark:text-white">
                {t("Create New API Key")}
              </p>
              <IconButton
                size="sm"
                shape="full"
                onClick={() => setIsCreating(false)}
              >
                <Icon icon="lucide:x" className="h-4 w-4 dark:text-white" />
              </IconButton>
            </div>
            <div className="p-4 md:px-6 md:py-8">
              <div className="w-full">
                <Input
                  placeholder={t("API Key Name")}
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  disabled={creating}
                  className="dark:bg-muted-800 dark:text-white"
                />
                <div className="grid grid-cols-2 gap-3 mt-4">
                  {permissionOptions.map((perm) => (
                    <div key={perm.value} className="flex items-center gap-2">
                      <Checkbox
                        id={perm.value}
                        checked={permissions.includes(perm.value)}
                        onChange={() =>
                          setPermissions((prev) =>
                            Array.isArray(prev) && prev.includes(perm.value)
                              ? prev.filter((p) => p !== perm.value)
                              : [...prev, perm.value]
                          )
                        }
                      />
                      <div>
                        <label
                          htmlFor={perm.value}
                          className="cursor-pointer dark:text-white text-md"
                        >
                          {perm.label}
                        </label>
                        <small className="block text-muted-500 dark:text-muted-400 text-sm">
                          {perm.description}
                        </small>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <h4 className="text-md font-semibold dark:text-muted-100 mb-2">
                    {t("IP Access Restrictions")}
                  </h4>
                  <div className="flex flex-col items-start gap-2 mb-4">
                    <Radio
                      type="radio"
                      id="unrestricted-create"
                      name="ipRestrictionCreate"
                      value="unrestricted"
                      label={t("Unrestricted (Less Secure)")}
                      checked={ipRestriction === "unrestricted"}
                      onChange={() => setIpRestriction("unrestricted")}
                    />
                    <div>
                      <p className="text-xs text-red-500 dark:text-red-400">
                        {t(
                          "This API Key allows access from any IP address. This is not recommended."
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Radio
                      id="restricted-create"
                      name="ipRestrictionCreate"
                      label={t(
                        "Restrict access to trusted IPs only (Recommended)"
                      )}
                      value="restricted"
                      checked={ipRestriction === "restricted"}
                      onChange={() => setIpRestriction("restricted")}
                    />
                  </div>
                  {ipRestriction === "restricted" && (
                    <>
                      <Input
                        placeholder={t("Enter IP to Whitelist")}
                        value={ipInput}
                        onChange={(e) => setIpInput(e.target.value)}
                        className="dark:bg-muted-800 dark:text-white mt-2"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") addIpToWhitelist();
                        }}
                      />
                      <Button
                        onClick={addIpToWhitelist}
                        className="mt-2"
                        disabled={!ipInput.trim()}
                      >
                        {t("Add IP")}
                      </Button>
                      <div className="mt-2">
                        {Array.isArray(ipWhitelist) &&
                          ipWhitelist.map((ip, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 mt-1"
                            >
                              <span className="dark:text-white">{ip}</span>
                              <IconButton
                                size="sm"
                                onClick={() => removeIpFromWhitelist(ip)}
                              >
                                <Icon
                                  icon="mdi:close"
                                  className="h-4 w-4 dark:text-white"
                                />
                              </IconButton>
                            </div>
                          ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="p-4 md:p-6 flex justify-end gap-2">
              <Button onClick={() => setIsCreating(false)} shape="smooth">
                {t("Cancel")}
              </Button>
              <Button
                variant="solid"
                color="primary"
                shape="smooth"
                onClick={createApiKey}
                loading={creating}
              >
                {creating ? t("Creating...") : t("Create")}
              </Button>
            </div>
          </Card>
        </Modal>
      </div>
    </Layout>
  );
};

export default ApiKeyManagement;
