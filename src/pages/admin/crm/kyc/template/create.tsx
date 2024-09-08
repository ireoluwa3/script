import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/router";
import Layout from "@/layouts/Default";
import Card from "@/components/elements/base/card/Card";
import Input from "@/components/elements/form/input/Input";
import Button from "@/components/elements/base/button/Button";
import { BackButton } from "@/components/elements/base/button/BackButton";
import $fetch from "@/utils/api";
import Checkbox from "@/components/elements/form/checkbox/Checkbox";
import Select from "@/components/elements/form/select/Select";
import IconButton from "@/components/elements/base/button-icon/IconButton";
import { Icon } from "@iconify/react";
import { useTranslation } from "next-i18next";
import { toast } from "sonner";
interface CustomOption {
  title: string;
  required: boolean;
  type: string;
  level: string;
}
type Option = {
  enabled: boolean;
  required: boolean;
  level: string;
};
interface Form {
  title: string;
  options: {
    firstName: Option;
    lastName: Option;
    email: Option;
    phone: Option;
    address: Option;
    city: Option;
    state: Option;
    country: Option;
    zip: Option;
    dob: Option;
    ssn: Option;
    documentPassport: Option;
    documentDriversLicense: Option;
    documentIdCard: Option;
  };
  customOptions: CustomOption[];
}
const CreateKycTemplate = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const initialFormState: Form = {
    title: "",
    options: {
      firstName: { enabled: false, required: false, level: "1" },
      lastName: { enabled: false, required: false, level: "1" },
      email: { enabled: false, required: false, level: "1" },
      phone: { enabled: false, required: false, level: "1" },
      address: { enabled: false, required: false, level: "1" },
      city: { enabled: false, required: false, level: "1" },
      state: { enabled: false, required: false, level: "1" },
      country: { enabled: false, required: false, level: "1" },
      zip: { enabled: false, required: false, level: "1" },
      dob: { enabled: false, required: false, level: "1" },
      ssn: { enabled: false, required: false, level: "1" },
      documentPassport: { enabled: false, required: false, level: "1" },
      documentDriversLicense: { enabled: false, required: false, level: "1" },
      documentIdCard: { enabled: false, required: false, level: "1" },
    },
    customOptions: [],
  };
  const [form, setForm] = useState<Form>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleAddCustomOption = () => {
    setForm((prevForm) => ({
      ...prevForm,
      customOptions: [
        ...prevForm.customOptions,
        { title: "", required: false, type: "input", level: "1" },
      ],
    }));
  };
  const handleRemoveCustomOption = (index: number) => {
    setForm((prevForm) => ({
      ...prevForm,
      customOptions: prevForm.customOptions.filter((_, i) => i !== index),
    }));
  };
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    const keys = name.split(".");
    const updateValue = type === "checkbox" ? checked : value;
    if (keys[0] === "options") {
      setForm((prevForm) => ({
        ...prevForm,
        options: {
          ...prevForm.options,
          [keys[1]]: {
            ...prevForm.options[keys[1]],
            [keys[2]]: updateValue,
          },
        },
      }));
    } else if (keys[0] === "customOptions") {
      const index = parseInt(keys[1], 10);
      const field = keys[2];
      const updatedCustomOptions = form.customOptions.map((option, i) =>
        i === index ? { ...option, [field]: updateValue } : option
      );
      setForm((prevForm) => ({
        ...prevForm,
        customOptions: updatedCustomOptions,
      }));
    } else {
      setForm((prevForm) => ({
        ...prevForm,
        [name]: updateValue,
      }));
    }
  };
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    const validate = form.customOptions.every((option) => option.title !== "");
    if (!validate) {
      setIsSubmitting(false);
      toast.error(t("Please fill in all custom option titles"));
      return;
    }
    const customOptionsObject = form.customOptions.reduce((acc, option) => {
      const { title, ...rest } = option;
      acc[title] = rest;
      return acc;
    }, {});
    const values = {
      ...form,
      customOptions: customOptionsObject,
    };
    const { error } = await $fetch({
      url: `/api/admin/crm/kyc/template`,
      method: "POST",
      body: values,
    });
    if (!error) {
      router.push("/admin/crm/kyc/template");
    }
    setIsSubmitting(false);
  };
  const keyMap = {
    firstName: {
      title: t("First Name"),
      description: t("The user's given name"),
    },
    lastName: {
      title: t("Last Name"),
      description: t("The user's family name"),
    },
    email: { title: t("Email"), description: t("The user's email address") },
    phone: { title: t("Phone"), description: t("The user's phone number") },
    address: {
      title: t("Address"),
      description: t("The user's street address"),
    },
    city: { title: t("City"), description: t("The user's city") },
    state: { title: t("State"), description: t("The user's state or region") },
    country: { title: t("Country"), description: t("The user's country") },
    zip: { title: t("Zip"), description: t("The user's postal code") },
    dob: { title: t("Date of Birth"), description: t("The user's birth date") },
    ssn: {
      title: t("SSN"),
      description: t("The user's social security number"),
    },
    documentPassport: {
      title: t("Passport"),
      description: t("The user's passport information"),
    },
    documentDriversLicense: {
      title: t("Driver License"),
      description: t("The user's driver's license information"),
    },
    documentIdCard: {
      title: t("ID Card"),
      description: t("The user's ID card information"),
    },
    customOptions: {
      title: t("Custom Options"),
      description: t("Fields for capturing additional user information"),
    },
  };
  const documents = [
    "documentPassport",
    "documentDriversLicense",
    "documentIdCard",
  ];
  const generalFields = Object.keys(keyMap).filter(
    (key) => !documents.includes(key) && key !== "customOptions"
  );
  const renderFieldSettings = (field: string) => (
    <div
      key={field}
      className={`p-5 flex xs:flex-col sm:flex-row justify-between items-start gap-5 text-muted-800 dark:text-muted-200 ${
        field !== "ssn" ? "border-b border-muted-300 dark:border-muted-700" : ""
      }`}
    >
      <div className="flex flex-col gap-2">
        <span>{keyMap[field].title}</span>
        <span className="text-sm text-muted-500 dark:text-muted-400">
          {keyMap[field].description}
        </span>
      </div>
      <div className="flex xs:flex-col sm:flex-row justify-end items-end gap-10">
        <div className="flex flex-col gap-5">
          <Checkbox
            color={"primary"}
            name={`options.${field}.enabled`}
            checked={form.options[field].enabled}
            onChange={handleChange}
            label={t("Enabled")}
          />
          <Checkbox
            label={t("Required")}
            color={"primary"}
            name={`options.${field}.required`}
            checked={form.options[field].required}
            onChange={handleChange}
          />
        </div>
        <Select
          label={t("Level")}
          name={`options.${field}.level`}
          value={form.options[field].level}
          onChange={handleChange}
          className="min-w-[96px]"
          options={[
            { value: "1", label: "1" },
            { value: "2", label: "2" },
            { value: "3", label: "3" },
          ]}
        />
      </div>
    </div>
  );
  return (
    <Layout title={t("Create KYC Template")} color="muted">
      <div className="flex justify-between items-center w-full mb-5">
        <h1 className="text-xl text-muted-800 dark:text-muted-200">
          {t("Create KYC Template")}
        </h1>
        <BackButton href="/admin/crm/kyc/template" />
      </div>
      <form onSubmit={handleSubmit} className="space-y-10">
        <Card className="p-5 space-y-5">
          <Input
            name="title"
            value={form.title}
            onChange={handleChange}
            type="text"
            label={t("Title")}
            placeholder={t("Enter template title")}
            className="w-full"
          />
        </Card>
        <Card>{generalFields.map(renderFieldSettings)}</Card>
        <Card>{documents.map(renderFieldSettings)}</Card>
        <Card className="p-5 space-y-5 text-muted-800 dark:text-muted-200">
          <div className="flex justify-between items-center">
            <h3 className="text-xl">{t("Custom Options")}</h3>
            <IconButton
              type="button"
              color="primary"
              onClick={handleAddCustomOption}
              variant={"outlined"}
            >
              <Icon icon="mdi:plus" className="h-5 w-5" />
            </IconButton>
          </div>
          {form.customOptions.map((option, index) => (
            <div key={index} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-5">
                <div className="col-span-1 sm:col-span-4">
                  <Input
                    type="text"
                    name={`customOptions.${index}.title`}
                    value={option.title}
                    onChange={handleChange}
                    label={t("Option Title")}
                    placeholder={t("Ex: username")}
                    className="w-full"
                  />
                </div>
                <div className="col-span-1 sm:col-span-3">
                  <Select
                    label={t("Type")}
                    name={`customOptions.${index}.type`}
                    value={option.type}
                    onChange={handleChange}
                    className="min-w-[96px]"
                    options={[
                      { value: "input", label: t("Input") },
                      { value: "textarea", label: t("Textarea") },
                      { value: "file", label: t("File Upload") },
                      { value: "image", label: t("Image Upload") },
                    ]}
                  />
                </div>
                <div className="col-span-1 sm:col-span-5">
                  <div className="flex items-end justify-end gap-5">
                    <Select
                      label={t("Level")}
                      name={`customOptions.${index}.level`}
                      value={option.level}
                      onChange={handleChange}
                      className="min-w-[96px]"
                      options={[
                        { value: "1", label: "1" },
                        { value: "2", label: "2" },
                        { value: "3", label: "3" },
                      ]}
                    />
                    <div>
                      <Checkbox
                        color={"primary"}
                        name={`customOptions.${index}.required`}
                        checked={option.required}
                        onChange={handleChange}
                        label={t("Required")}
                      />
                    </div>
                    <IconButton
                      type="button"
                      color="danger"
                      onClick={() => handleRemoveCustomOption(index)}
                    >
                      <Icon icon="mdi:trash-can" className="h-4 w-4" />
                    </IconButton>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Card>
        <div className="flex items-center justify-center">
          <Card className="p-2 w-64">
            <Button
              disabled={isSubmitting}
              loading={isSubmitting}
              color="primary"
              type="submit"
              className="w-full"
            >
              {t("Create")}
            </Button>
          </Card>
        </div>
      </form>
    </Layout>
  );
};
export default CreateKycTemplate;
export const permission = "Access KYC Template Management";
