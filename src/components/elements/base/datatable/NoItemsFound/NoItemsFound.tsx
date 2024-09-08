import { NoItemsFoundProps } from "./NoItemsFound.types";
import { Icon } from "@iconify/react";
import { useTranslation } from "next-i18next";
const NoItemsFoundBase = ({ cols }: NoItemsFoundProps) => {
  const { t } = useTranslation();
  return (
    <tr>
      <td colSpan={cols} className="py-3 text-center">
        <div className="py-32">
          <Icon
            icon="arcticons:samsung-finder"
            className="mx-auto h-20 w-20 text-muted-400"
          />
          <h3 className="mb-2 font-sans text-xl text-muted-800 dark:text-muted-100">
            {t("Nothing found")}
          </h3>
          <p className="mx-auto max-w-[280px] font-sans text-sm text-muted-400">
            {t(
              "Sorry, looks like we couldn't find any matching records. Try different search terms."
            )}
          </p>
        </div>
      </td>
    </tr>
  );
};
export const NoItemsFound = NoItemsFoundBase;
