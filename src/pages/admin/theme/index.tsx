import React from "react";

import Head from "next/head";
import { useTranslation } from "next-i18next";
import { EditorProvider } from "@/components/builder";

function Builder() {
  const { t } = useTranslation();

  return (
    <div className="h-screen">
      <Head>
        <title>{t("Builder")}</title>
      </Head>
      <EditorProvider />
    </div>
  );
}
export default Builder;
export const permission = "Access Frontend Builder";
