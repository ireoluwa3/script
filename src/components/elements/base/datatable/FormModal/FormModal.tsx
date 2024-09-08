import React, { useState } from "react";
import Modal from "../../modal/Modal";
import Button from "../../button/Button";
import Card from "../../card/Card";
import IconButton from "../../button-icon/IconButton";
import { Icon } from "@iconify/react";
import { useDataTable } from "@/stores/datatable";
import pluralize from "pluralize";
import { FormRenderer } from "./FormRenderer";
import { useTranslation } from "next-i18next";
const FormModalBase = () => {
  const { t } = useTranslation();
  const { modalAction, activeModal, closeModal, handleSubmit, props } =
    useDataTable((state) => state);
  const [formValues, setFormValues] = useState({});
  return (
    <Modal
      open={!!activeModal}
      size={props?.formSize || modalAction?.modelSize}
    >
      <Card shape="smooth">
        <div className="flex items-center justify-between p-4 md:p-6">
          <p className="font-sans text-lg font-medium text-muted-900 dark:text-white">
            {modalAction?.label} {pluralize.singular(props?.title)}
          </p>
          <IconButton size="sm" shape="full" onClick={() => closeModal()}>
            <Icon icon="lucide:x" className="h-4 w-4" />
          </IconButton>
        </div>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="p-4 md:px-6 md:py-8 overflow-y-auto max-h-[65vh]">
            <div className="mx-auto w-full space-y-4">
              <FormRenderer
                formValues={formValues}
                setFormValues={setFormValues}
              />
            </div>
          </div>
          <div className="p-4 md:p-6">
            <div className="flex w-full justify-end gap-2">
              <Button shape="smooth" onClick={() => closeModal()}>
                {t("Cancel")}
              </Button>
              <Button
                variant="solid"
                color="primary"
                shape="smooth"
                onClick={() => handleSubmit(formValues)}
              >
                {t("Submit")}
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </Modal>
  );
};
export const FormModal = FormModalBase;
