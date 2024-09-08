import Modal from "../../modal/Modal";
import Button from "../../button/Button";
import Card from "../../card/Card";
import IconButton from "../../button-icon/IconButton";
import { Icon } from "@iconify/react";
import { useDataTable } from "@/stores/datatable";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
const ConfirmationModalBase = () => {
  const { t } = useTranslation();
  const { activeModal, handleDelete, handleBulkDelete, closeModal, fetchData } =
    useDataTable((state) => state);
  const router = useRouter();
  const isLog = router.pathname.includes("/admin/system/log");
  const modalConfig = {
    Confirm: {
      title: "Confirm action",
      description: "Are you sure you want to perform this action?",
      onConfirm: () => {
        fetchData();
        closeModal();
      },
    },
    Delete: {
      title: "Delete this record?",
      description:
        "Are you sure you want to remove this record? Make sure you don‘t need it anymore as it will be deleted and you won‘t be able to recover it.",
      onConfirm: () =>
        isLog
          ? handleDelete(undefined, undefined, true, router.query)
          : handleDelete(),
    },
    Restore: {
      title: "Restore this record?",
      description:
        "Are you sure you want to restore this record? It will be available again in the list.",
      isRestoring: true,
      onConfirm: () => handleDelete(true),
    },
    PermanentDelete: {
      title: "Permanently delete this record?",
      description:
        "Are you sure you want to permanently delete this record? It will be removed from the system and you won't be able to recover it.",
      onConfirm: () => handleDelete(false, true),
    },
    BulkDelete: {
      title: "Delete selected records?",
      description:
        "Are you sure you want to delete the selected records? Make sure you don't need them anymore as they will be deleted and you won't be able to recover them.",
      onConfirm: () =>
        isLog
          ? handleBulkDelete(undefined, undefined, true, router.query)
          : handleBulkDelete(),
    },
    BulkRestore: {
      title: "Restore selected records?",
      description:
        "Are you sure you want to restore the selected records? They will be available again in the list.",
      isRestoring: true,
      onConfirm: () => handleBulkDelete(true),
    },
    BulkPermanentDelete: {
      title: "Permanently delete selected records?",
      description: `Are you sure you want to permanently delete the selected records? They will be removed from the system and you won't be able to recover them.`,
      onConfirm: () => handleBulkDelete(false, true),
    },
  };
  const config = activeModal ? modalConfig[activeModal] || {} : {};
  return (
    <Modal open={!!activeModal} size="md">
      <Card shape="smooth">
        <div className="flex items-center justify-between p-4 md:p-6">
          <p className="font-sans text-lg font-medium text-muted-900 dark:text-white">
            {config.title}
          </p>
          <IconButton size="sm" shape="full" onClick={() => closeModal()}>
            <Icon icon="lucide:x" className="h-4 w-4" />
          </IconButton>
        </div>
        <div className="p-4 md:px-6 md:py-8">
          <div className="mx-auto w-full">
            <p className="font-sans text-sm text-muted-500 dark:text-muted-400">
              {config.description}
            </p>
          </div>
        </div>
        <div className="p-4 md:p-6 ">
          <div className="flex w-full justify-end gap-2">
            <Button shape="smooth" onClick={() => closeModal()}>
              {t("Cancel")}
            </Button>
            <Button
              variant="solid"
              color={config.isRestoring ? "warning" : "danger"}
              shape="smooth"
              onClick={() => config.onConfirm()}
            >
              {t("Confirm")}
            </Button>
          </div>
        </div>
      </Card>
    </Modal>
  );
};
export const ConfirmationModal = ConfirmationModalBase;
