import Message from "../../message/Message";
import Button from "../../button/Button";
import { Icon } from "@iconify/react";
import { useDataTable } from "@/stores/datatable";
import { useTranslation } from "next-i18next";
const BulkSelectionMessageBase = () => {
  const { t } = useTranslation();
  const { clearSelection, selectedItems, navActionsState, handleAction } =
    useDataTable((state) => state);
  return (
    <Message onClose={clearSelection}>
      <div className="flex flex-col items-start sm:items-center justify-start sm:justify-between sm:flex-row gap-5 w-full">
        <div>
          <p className="text-sm font-normal leading-tight text-muted-800 dark:text-muted-100">
            {selectedItems.length} {t("item(s) selected")}
          </p>
          <p className="text-xs text-muted-400">
            {t("Click on an item to deselect it")}
          </p>
        </div>
        <div className="flex items-center gap-3 me-2">
          <Button
            variant="pastel"
            color="danger"
            size={"sm"}
            onClick={() => {
              handleAction({
                type: "modal",
                modalType: "confirmation",
                topic: navActionsState.showDeleted
                  ? "bulk-permanent-delete"
                  : "bulk-delete",
              });
            }}
          >
            <Icon
              icon={
                navActionsState.showDeleted
                  ? "ph:trash-simple"
                  : "ph:trash-duotone"
              }
              className="h-5 w-5 me-1"
            />
            {navActionsState.showDeleted ? "Delete Permanently" : "Delete"}
          </Button>
          {navActionsState.showDeleted && (
            <Button
              variant="pastel"
              color="warning"
              size={"sm"}
              onClick={() => {
                handleAction({
                  type: "modal",
                  modalType: "confirmation",
                  topic: "bulk-restore",
                });
              }}
            >
              <Icon icon="ph:arrow-clockwise" className="h-5 w-5 me-1" />
              {t("Restore")}
            </Button>
          )}
        </div>
      </div>
    </Message>
  );
};
export const BulkSelectionMessage = BulkSelectionMessageBase;
