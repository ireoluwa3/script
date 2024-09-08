import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "@/layouts/Default";
import Card from "@/components/elements/base/card/Card";
import Button from "@/components/elements/base/button/Button";
import Heading from "@/components/elements/base/heading/Heading";
import $fetch from "@/utils/api";
import ButtonLink from "@/components/elements/base/button-link/ButtonLink";
import { Icon } from "@iconify/react";
import Input from "@/components/elements/form/input/Input";
import Textarea from "@/components/elements/form/textarea/Textarea";
import ToggleSwitch from "@/components/elements/form/toggle-switch/ToggleSwitch";
import { useTranslation } from "next-i18next";

type FormInput = {
  subject: string;
  emailBody?: string;
  smsBody?: string;
  pushBody?: string;
  email?: boolean;
  sms?: boolean;
  push?: boolean;
  shortCodes?: string;
};
const NotificationTemplateEdit: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = router.query;
  const [template, setTemplate] = useState<FormInput | null>(null);
  const [formValues, setFormValues] = useState<FormInput>({
    subject: "",
    emailBody: "",
    smsBody: "",
    pushBody: "",
    email: false,
    sms: false,
    push: false,
    shortCodes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    const fetchTemplate = async () => {
      const { data } = await $fetch({
        url: `/api/admin/system/notification/template/${id}`,
        silent: true,
      });
      setTemplate({
        subject: data.subject,
        shortCodes: data.shortCodes,
      });
      setFormValues({
        subject: data.subject,
        emailBody: data.emailBody || "",
        smsBody: data.smsBody || "",
        pushBody: data.pushBody || "",
        email: data.email || false,
        sms: data.sms || false,
        push: data.push || false,
      });
    };
    if (id) {
      fetchTemplate();
    }
  }, [id]);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const handleSwitchChange = (name: string, newValue: boolean) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: newValue,
    }));
  };
  const handleSubmit = async () => {
    setIsSubmitting(true);
    const { error } = await $fetch({
      url: `/api/admin/system/notification/template/${id}`,
      method: "PUT",
      body: formValues,
    });
    if (!error) {
      router.push("/admin/system/notification/template");
    }
    setIsSubmitting(false);
  };
  const shortcodesMap = (item: string) => {
    const map: {
      [key: string]: string;
    } = {
      FIRSTNAME: t("User first name"),
      LASTNAME: t("User last name"),
      EMAIL: t("User email"),
      PHONE: t("User phone"),
      COMPANY: t("User company"),
      ADDRESS: t("User address"),
      CITY: t("User city"),
      STATE: t("User state"),
      ZIP: t("User zip"),
      COUNTRY: t("User country"),
      PASSWORD: t("User password"),
      USERNAME: t("User username"),
      URL: t("Site url"),
      CREATED_AT: t("Template related Created at"),
      UPDATED_AT: t("Updated at date"),
      SITE_NAME: t("Site name"),
      SITE_URL: t("Site url"),
      SITE_EMAIL: t("Site email"),
      SITE_PHONE: t("Site phone"),
      SITE_ADDRESS: t("Site address"),
      TOKEN: t("Template related token"),
      LAST_LOGIN: t("User last login"),
    };
    return map[item] || item;
  };
  return (
    <Layout title={t("Notification Template")} color="muted">
      <div className="flex justify-between items-center mb-5">
        <Heading as="h1" size="lg">
          {t("Editing")} {template?.subject} {t("Template")}
        </Heading>
        <div className="flex justify-end">
          <Button
            type="button"
            color="success"
            className="mr-2"
            onClick={handleSubmit}
            disabled={isSubmitting}
            loading={isSubmitting}
          >
            <Icon icon="line-md:confirm" className="w-5 h-5 mr-2" />
            {t("Save")}
          </Button>
          <ButtonLink href="/admin/system/notification/template" color="muted">
            <Icon icon="line-md:arrow-small-left" className="w-5 h-5 mr-2" />
            {t("Back")}
          </ButtonLink>
        </div>
      </div>
      <div className="grid gap-5 xs:grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
        <div className="xs:col-span-1 md:col-span-2 lg:col-span-3 space-y-5">
          <Input
            name="subject"
            label={t("Subject")}
            placeholder={t("Enter subject")}
            value={formValues.subject}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          <Textarea
            name="emailBody"
            label={t("Email Body")}
            placeholder={t("Enter email body")}
            rows={10}
            value={formValues.emailBody || ""}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          <Textarea
            name="smsBody"
            label={t("SMS Body")}
            placeholder={t("Enter sms body")}
            value={formValues.smsBody || ""}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          <Textarea
            name="pushBody"
            label={t("Push Body")}
            placeholder={t("Enter push body")}
            value={formValues.pushBody || ""}
            onChange={handleChange}
            disabled={isSubmitting}
          />
        </div>
        <div className="col-span-1">
          <Card className="p-5">
            <Heading as="h2" size="md" className="mb-5 text-muted">
              {t("Variables")}
            </Heading>
            <div className="space-y-3 text-xs">
              {template?.shortCodes &&
                JSON.parse(template.shortCodes).map(
                  (item: string, index: number) => (
                    <div key={index} className="flex flex-col">
                      <span className="text-gray-600 dark:text-gray-400">
                        %
                        <span className="font-semibold text-gray-800 dark:text-gray-200">
                          {item}
                        </span>
                        %
                      </span>
                      <span className="text-gray-500">
                        {shortcodesMap(item)}
                      </span>
                    </div>
                  )
                )}
            </div>
          </Card>
          <Card className="p-5 mt-5">
            <div className="space-y-3 text-xs">
              <div>
                <ToggleSwitch
                  id="email-switch"
                  name="email"
                  label={t("Email")}
                  sublabel={t("Send emails notifications")}
                  color="primary"
                  checked={formValues.email ?? false}
                  onChange={() =>
                    handleSwitchChange("email", !formValues.email)
                  }
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <ToggleSwitch
                  id="sms-switch"
                  name="sms"
                  label={t("SMS (coming soon)")}
                  sublabel={t("Send sms notifications")}
                  color="primary"
                  checked={formValues.sms ?? false}
                  onChange={() => handleSwitchChange("sms", !formValues.sms)}
                  disabled={true}
                />
              </div>
              <div>
                <ToggleSwitch
                  id="push-switch"
                  name="push"
                  label={t("Push (coming soon)")}
                  sublabel={t("Send push notifications")}
                  color="primary"
                  checked={formValues.push ?? false}
                  onChange={() => handleSwitchChange("push", !formValues.push)}
                  disabled={true}
                />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};
export default NotificationTemplateEdit;
export const permission = "Access Notification Template Management";
