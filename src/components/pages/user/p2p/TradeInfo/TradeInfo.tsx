import { memo } from "react";
import ListWidgetItem from "@/components/widgets/ListWidgetItem";
import IconBox from "@/components/elements/base/iconbox/IconBox";
import { capitalize } from "lodash";
import Link from "next/link";
import { Icon } from "@iconify/react";
import useP2PStore from "@/stores/user/p2p/trade";
import { useTranslation } from "next-i18next";

const TradeInfoBase = () => {
  const { t } = useTranslation();
  const { trade, isSeller } = useP2PStore();

  const disputeStatus = {
    PENDING: {
      icon: "ph:circle-duotone",
      className: "bg-warning-500/10",
      iconClasses: "text-warning-500",
    },
    IN_PROGRESS: {
      icon: "ph:circle-duotone",
      className: "bg-info-500/10",
      iconClasses: "text-info-500",
    },
    RESOLVED: {
      icon: "ph:circle-duotone",
      className: "bg-success-500/10",
      iconClasses: "text-success-500",
    },
    CANCELLED: {
      icon: "ph:circle-duotone",
      className: "bg-danger-500/10",
      iconClasses: "text-danger-500",
    },
  };

  const statusIcons = {
    PENDING: {
      icon: "ph:circle-duotone",
      className: "bg-warning-500/10",
      iconClasses: "text-warning-500",
    },
    PAID: {
      icon: "ph:circle-duotone",
      className: "bg-info-500/10",
      iconClasses: "text-info-500",
    },
    DISPUTE_OPEN: {
      icon: "ph:circle-duotone",
      className: "bg-danger-500/10",
      iconClasses: "text-danger-500",
    },
    ESCROW_REVIEW: {
      icon: "ph:circle-duotone",
      className: "bg-info-500/10",
      iconClasses: "text-info-500",
    },
    CANCELLED: {
      icon: "ph:circle-duotone",
      className: "bg-danger-500/10",
      iconClasses: "text-danger-500",
    },
    COMPLETED: {
      icon: "ph:circle-duotone",
      className: "bg-success-500/10",
      iconClasses: "text-success-500",
    },
    REFUNDED: {
      icon: "ph:circle-duotone",
      className: "bg-secondary-500/10",
      iconClasses: "text-secondary-500",
    },
  };

  // Function to get icon configuration based on status
  const getIconConfig = (status) => {
    return statusIcons[status] || statusIcons["PENDING"]; // Default to PENDING if status is undefined
  };

  return (
    <>
      <div className="border-b-2 border-dashed border-muted-200 p-6 dark:border-muted-800">
        <h4 className="mb-4 font-sans text-xs font-medium uppercase text-muted-500">
          {t("Payment Method")}
        </h4>

        <ul className="relative">
          <li>
            <ListWidgetItem
              href="#"
              avatarSize="xs"
              avatar={
                <IconBox
                  icon="ph:calendar-duotone"
                  className="!h-8 !w-8 !rounded-lg bg-success-500/10"
                  iconClasses="!h-5 !w-5 text-success-500"
                />
              }
              title={t("Method")}
              text={trade?.offer.paymentMethod.name || "Loading..."}
              itemAction={<></>}
            />
            <ListWidgetItem
              href="#"
              avatarSize="xs"
              avatar={
                <IconBox
                  icon="ph:calendar-duotone"
                  className="!h-8 !w-8 !rounded-lg bg-success-500/10"
                  iconClasses="!h-5 !w-5 text-success-500"
                />
              }
              title={t("Currency")}
              text={trade?.offer.currency || "Loading..."}
              itemAction={<></>}
            />
            {trade?.offer.paymentMethod.chain && (
              <ListWidgetItem
                href="#"
                avatarSize="xs"
                avatar={
                  <IconBox
                    icon="ph:calendar-duotone"
                    className="!h-8 !w-8 !rounded-lg bg-success-500/10"
                    iconClasses="!h-5 !w-5 text-success-500"
                  />
                }
                title={t("Chain")}
                text={trade?.offer.paymentMethod.chain || "Loading..."}
                itemAction={<></>}
              />
            )}
            <ListWidgetItem
              href="#"
              avatarSize="xs"
              avatar={
                <IconBox
                  icon="ph:timer-duotone"
                  className="!h-8 !w-8 !rounded-lg bg-success-500/10"
                  iconClasses="!h-5 !w-5 text-success-500"
                />
              }
              title={t("Instructions")}
              text={trade?.offer.paymentMethod.instructions || "Loading..."}
              itemAction={<></>}
            />
          </li>
        </ul>
      </div>
      <div className="p-6">
        <h4 className="mb-4 font-sans text-xs font-medium uppercase text-muted-500">
          {t("Summary")}
        </h4>

        <ul className="relative">
          <li>
            <ListWidgetItem
              href="#"
              avatarSize="xs"
              avatar={
                <IconBox
                  icon="ph:timer-duotone"
                  className="!h-8 !w-8 !rounded-lg bg-success-500/10"
                  iconClasses="!h-5 !w-5 text-success-500"
                />
              }
              title={t("Transaction Hash")}
              text={trade?.txHash || "Not provided by buyer yet..."}
              itemAction={<></>}
            />
            {isSeller && (
              <ListWidgetItem
                href="#"
                avatarSize="xs"
                avatar={
                  <IconBox
                    icon="ph:envelope-duotone"
                    className="!h-8 !w-8 !rounded-lg bg-info-500/10"
                    iconClasses="!h-5 !w-5 text-info-500"
                  />
                }
                title={t("Email")}
                text={trade?.user?.email || "Loading..."}
                itemAction={
                  <Link
                    href={`mailto:${trade?.user?.email}`}
                    className="cursor-pointer text-muted-400 transition-colors duration-300 hover:text-primary-500"
                  >
                    <Icon icon="lucide:arrow-right" />
                  </Link>
                }
              />
            )}
            <ListWidgetItem
              href="#"
              avatarSize="xs"
              avatar={
                <IconBox
                  {...getIconConfig(trade?.status.toUpperCase())}
                  className="!h-8 !w-8 !rounded-lg"
                />
              }
              title={t("Status")}
              text={`${capitalize(trade?.status) || "Loading..."}`}
              itemAction={<></>}
            />
            <ListWidgetItem
              href="#"
              avatarSize="xs"
              avatar={
                <IconBox
                  icon="ph:info-duotone"
                  className="!h-8 !w-8 !rounded-lg bg-primary-500/10"
                  iconClasses="!h-5 !w-5 text-primary-500"
                />
              }
              title={t("You are the")}
              text={isSeller ? t("Seller") : t("Buyer")}
              itemAction={<></>}
            />
          </li>
        </ul>
      </div>

      {trade?.p2pDisputes[0] && (
        <div className="border-t-2 border-dashed border-muted-200 p-6 dark:border-muted-800">
          <h4 className="mb-4 font-sans text-xs font-medium uppercase text-muted-500">
            {t("Dispute")}
          </h4>

          <ul className="relative">
            <li>
              <ListWidgetItem
                href="#"
                avatarSize="xs"
                avatar={
                  <IconBox
                    {...getIconConfig(
                      trade?.p2pDisputes[0].status.toUpperCase()
                    )}
                    className="!h-8 !w-8 !rounded-lg"
                  />
                }
                title={t("Status")}
                text={`${
                  capitalize(trade?.p2pDisputes[0].status) || "Loading..."
                }`}
                itemAction={<></>}
              />
              <ListWidgetItem
                href="#"
                avatarSize="xs"
                avatar={
                  <IconBox
                    icon="ph:calendar-duotone"
                    className="!h-8 !w-8 !rounded-lg bg-success-500/10"
                    iconClasses="!h-5 !w-5 text-success-500"
                  />
                }
                title={t("Raised by")}
                text={`${trade?.p2pDisputes[0].raisedBy?.firstName} ${trade?.p2pDisputes[0].raisedBy?.lastName}`}
                itemAction={<></>}
              />
              <ListWidgetItem
                href="#"
                avatarSize="xs"
                avatar={
                  <IconBox
                    icon="ph:calendar-duotone"
                    className="!h-8 !w-8 !rounded-lg bg-success-500/10"
                    iconClasses="!h-5 !w-5 text-success-500"
                  />
                }
                title={t("Reason")}
                text={
                  trade?.p2pDisputes[0].reason || "Not provided by buyer yet..."
                }
                itemAction={<></>}
              />
              <ListWidgetItem
                href="#"
                avatarSize="xs"
                avatar={
                  <IconBox
                    icon="ph:calendar-duotone"
                    className="!h-8 !w-8 !rounded-lg bg-success-500/10"
                    iconClasses="!h-5 !w-5 text-success-500"
                  />
                }
                title={t("Resolution")}
                text={
                  trade?.p2pDisputes[0].resolution ||
                  "Not provided by buyer yet..."
                }
                itemAction={<></>}
              />
            </li>
          </ul>
        </div>
      )}
    </>
  );
};

export const TradeInfo = memo(TradeInfoBase);
