import { memo } from "react";
import ListWidgetItem from "@/components/widgets/ListWidgetItem";
import IconBox from "@/components/elements/base/iconbox/IconBox";
import { capitalize } from "lodash";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { formatDate } from "date-fns";
import useSupportStore from "@/stores/user/support";
import { useTranslation } from "next-i18next";
const TicketInformationBase = () => {
  const { t } = useTranslation();
  const { ticket, isSupport } = useSupportStore();
  // Mapping for icon configurations based on the ticket status
  const statusIcons = {
    PENDING: {
      icon: "ph:circle-duotone",
      className: "bg-warning-500/10",
      iconClasses: "text-warning-500",
    },
    OPEN: {
      icon: "ph:circle-duotone",
      className: "bg-info-500/10",
      iconClasses: "text-info-500",
    },
    REPLIED: {
      icon: "ph:circle-duotone",
      className: "bg-primary-500/10",
      iconClasses: "text-primary-500",
    },
    CLOSED: {
      icon: "ph:check-circle-duotone",
      className: "bg-success-500/10",
      iconClasses: "text-success-500",
    },
  };
  // Function to get icon configuration based on status
  const getIconConfig = (status) => {
    return statusIcons[status] || statusIcons["PENDING"]; // Default to PENDING if status is undefined
  };
  return (
    <div className="border-b-2 border-dashed border-muted-200 p-6 dark:border-muted-800">
      <h4 className="mb-4 font-sans text-xs font-medium uppercase text-muted-500">
        {t("Information")}
      </h4>

      <ul className="relative">
        <li>
          <ListWidgetItem
            href="#"
            avatarSize="xs"
            avatar={
              <IconBox
                icon="ph:credit-card-duotone"
                className="!h-8 !w-8 !rounded-lg bg-primary-500/10"
                iconClasses="!h-5 !w-5 text-primary-500"
              />
            }
            title={t("Ticket ID")}
            text={ticket?.id || "Loading..."}
            itemAction={<></>}
          />
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
            title={t("Priority")}
            text={capitalize(ticket?.importance) || "Loading..."}
            itemAction={<></>}
          />
          {isSupport && (
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
              text={ticket?.user?.email || "Loading..."}
              itemAction={
                <Link
                  href={`mailto:${ticket?.user?.email}`}
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
                {...getIconConfig(ticket?.status.toUpperCase())}
                className="!h-8 !w-8 !rounded-lg"
              />
            }
            title={t("Status")}
            text={`${capitalize(ticket?.status) || "Loading..."} ${formatDate(
              new Date(ticket?.updatedAt || new Date()),
              "MMM dd, yyyy h:mm a"
            )}`}
            itemAction={<></>}
          />
        </li>
      </ul>
    </div>
  );
};
export const TicketInformation = memo(TicketInformationBase);
