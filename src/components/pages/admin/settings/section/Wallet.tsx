import Button from "@/components/elements/base/button/Button";
import { useTranslation } from "next-i18next";
import renderField from "../RenderField";

const walletFields = [
  {
    name: "depositExpiration",
    label: "Deposit Expiration",
    placeholder: "Select an option",
    description:
      "Spot wallet deposit expiration limit to prevent lookups from use random transactions that sent to the spot wallet address",
    type: "switch",
  },
  {
    name: "fiatWallets",
    label: "Fiat Wallets",
    placeholder: "Select an option",
    description: "Enable or disable fiat wallets",
    type: "switch",
  },
  {
    name: "deposit",
    label: "Deposit",
    placeholder: "Select an option",
    description: "Enable or disable deposits",
    type: "switch",
  },
  {
    name: "withdraw",
    label: "Withdraw",
    placeholder: "Select an option",
    description: "Enable or disable withdrawals",
    type: "switch",
  },
  {
    name: "transfer",
    label: "Transfer",
    placeholder: "Select an option",
    description: "Enable or disable transfers",
    type: "switch",
  },
];

const WalletSection = ({
  formData,
  handleInputChange,
  handleCancel,
  handleSave,
  hasChanges,
  isLoading,
}) => {
  const { t } = useTranslation();
  return (
    <div className="grid w-full grid-cols-12 gap-6">
      <div className="col-span-12 lg:col-span-4 ltablet:col-span-4">
        <div className="mt-4 space-y-2">
          <h3 className="text-lg font-medium tracking-wide text-muted-800 dark:text-muted-100">
            {t("Wallet")}
          </h3>
          <p className="max-w-xs text-sm text-muted-400">
            {t("Manage wallet-related settings and restrictions.")}
          </p>
        </div>
      </div>
      <div className="col-span-12 lg:col-span-7 ltablet:col-span-7">
        <div className="lg:max-w-xl">
          <div className="grid w-full grid-cols-12 gap-x-6 gap-y-4">
            {walletFields.map((field) =>
              renderField({ field, formData, handleInputChange })
            )}
            {hasChanges && (
              <div className="col-span-12 flex justify-end space-x-4">
                <Button color="default" onClick={handleCancel}>
                  {t("Cancel")}
                </Button>
                <Button
                  color="primary"
                  onClick={handleSave}
                  loading={isLoading}
                >
                  {t("Save Changes")}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletSection;
