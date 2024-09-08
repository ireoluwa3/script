// components/ContactInfo.js
import React from "react";
import ToggleSwitch from "@/components/elements/form/toggle-switch/ToggleSwitch";
import Card from "../base/card/Card";
import { useTranslation } from "next-i18next";
const ContactInfo = ({ field, data }) => {
  const { t } = useTranslation();
  return (
    <Card className="p-5 flex w-full gap-5 items-start justify-start mb-5">
      <ToggleSwitch
        label={t("Email Verified")}
        color="success"
        name={field.emailVerified.name}
        checked={data.emailVerified}
        disabled
      />
    </Card>
  );
};
export default ContactInfo;
