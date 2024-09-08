"use client";
import { StrictMode, useEffect, useRef, useState } from "react";
import Layout from "@/layouts/Minimal";
import { useRouter } from "next/router";
import { useDashboardStore } from "@/stores/dashboard";
import $fetch from "@/utils/api";
import { BackButton } from "@/components/elements/base/button/BackButton";
import Button from "@/components/elements/base/button/Button";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { useTranslation } from "next-i18next";
const EmailEditor = dynamic(() => import("react-email-editor"), { ssr: false });
const CreateTemplate = () => {
  const { t } = useTranslation();
  const { isDark } = useDashboardStore();
  const router = useRouter();
  const { id } = router.query as {
    id: string;
  };
  const emailEditorRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [template, setTemplate] = useState<any>({});
  const [editorReady, setEditorReady] = useState(false);
  const onLoad = (unlayer: any) => {
    console.log("onLoad", unlayer);
    emailEditorRef.current = unlayer; // Ensure the reference is set here
    unlayer.addEventListener("design:loaded", (data: any) => {
      console.log("onDesignLoad", data);
    });
  };
  const onReady = (unlayer: any) => {
    console.log("onReady", unlayer);
    setEditorReady(true);
  };
  const fetchTemplate = async () => {
    const { data, error } = await $fetch({
      url: `/api/admin/ext/mailwizard/template/${id}`,
      silent: true,
    });
    if (!error) {
      setTemplate(data);
    }
  };
  useEffect(() => {
    if (router.isReady) {
      fetchTemplate();
    }
  }, [router.isReady]);
  useEffect(() => {
    if (editorReady && template.design) {
      const unlayer = emailEditorRef.current;
      if (unlayer && unlayer.loadDesign) {
        let design;
        try {
          design = JSON.parse(template.design);
        } catch (error) {
          design = {};
        }
        unlayer.loadDesign(design);
      }
    }
  }, [editorReady, template]);
  const save = async () => {
    setIsLoading(true);
    const unlayer = emailEditorRef.current;
    if (!unlayer) {
      toast.error("Editor not loaded");
      setIsLoading(false);
      return;
    }
    unlayer.exportHtml(async (data: any) => {
      const { design, html } = data;
      const { error } = await $fetch({
        url: `/api/admin/ext/mailwizard/template/${id}`,
        method: "PUT",
        body: {
          content: html,
          design: JSON.stringify(design),
        },
      });
      if (!error) {
        router.push("/admin/ext/mailwizard/template");
      }
      setIsLoading(false);
    });
  };
  return (
    <Layout title={t("Create Mailwizard Template")} color="muted">
      <div className="flex justify-between items-center mb-4 p-4">
        <div>
          <h1 className="text-xl">
            {t("Edit")}
            {template.name}
            {t("Template")}
          </h1>
        </div>
        <div className="flex gap-2">
          <BackButton href="/admin/ext/mailwizard/template" />
          <Button
            type="button"
            color="primary"
            onClick={save}
            disabled={isLoading || !emailEditorRef.current}
            loading={isLoading || !emailEditorRef.current}
          >
            {t("Save")}
          </Button>
        </div>
      </div>
      <StrictMode>
        <div className="w-full">
          <EmailEditor
            ref={emailEditorRef}
            onLoad={onLoad}
            onReady={onReady}
            options={{
              displayMode: "email",
              appearance: {
                theme: isDark ? "dark" : "modern_light",
                panels: {
                  tools: {
                    dock: "left",
                  },
                },
              },
            }}
          />
        </div>
      </StrictMode>
    </Layout>
  );
};
export default CreateTemplate;
export const permission = "Access Mailwizard Template Management";
