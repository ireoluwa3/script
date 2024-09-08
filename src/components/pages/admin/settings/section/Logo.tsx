import renderField from "../RenderField";
import { useTranslation } from "next-i18next";

const logoFields = [
  {
    name: "logo",
    label: "Logo",
    type: "file",
    dir: "logo",
    size: { width: 96, height: 96, maxWidth: 96, maxHeight: 96 },
  },
  {
    name: "cardLogo",
    label: "Card Logo",
    type: "file",
    dir: "logo",
    size: { width: 256, height: 256, maxWidth: 256, maxHeight: 256 },
  },
  {
    name: "darkLogo",
    label: "Dark Logo",
    type: "file",
    dir: "logo",
    size: { width: 96, height: 96, maxWidth: 96, maxHeight: 96 },
  },
  {
    name: "fullLogo",
    label: "Full Logo",
    type: "file",
    dir: "logo",
    size: { width: 350, height: 75, maxWidth: 350, maxHeight: 75 },
  },
  {
    name: "darkFullLogo",
    label: "Dark Full Logo",
    type: "file",
    dir: "logo",
    size: { width: 350, height: 75, maxWidth: 350, maxHeight: 75 },
  },
  {
    name: "appleIcon57",
    label: "Apple Icon 57x57",
    type: "file",
    dir: "logo",
    size: { width: 57, height: 57, maxWidth: 57, maxHeight: 57 },
  },
  {
    name: "appleIcon60",
    label: "Apple Icon 60x60",
    type: "file",
    dir: "logo",
    size: { width: 60, height: 60, maxWidth: 60, maxHeight: 60 },
  },
  {
    name: "appleIcon72",
    label: "Apple Icon 72x72",
    type: "file",
    dir: "logo",
    size: { width: 72, height: 72, maxWidth: 72, maxHeight: 72 },
  },
  {
    name: "appleIcon76",
    label: "Apple Icon 76x76",
    type: "file",
    dir: "logo",
    size: { width: 76, height: 76, maxWidth: 76, maxHeight: 76 },
  },
  {
    name: "appleIcon114",
    label: "Apple Icon 114x114",
    type: "file",
    dir: "logo",
    size: { width: 114, height: 114, maxWidth: 114, maxHeight: 114 },
  },
  {
    name: "appleIcon120",
    label: "Apple Icon 120x120",
    type: "file",
    dir: "logo",
    size: { width: 120, height: 120, maxWidth: 120, maxHeight: 120 },
  },
  {
    name: "appleIcon144",
    label: "Apple Icon 144x144",
    type: "file",
    dir: "logo",
    size: { width: 144, height: 144, maxWidth: 144, maxHeight: 144 },
  },
  {
    name: "appleIcon152",
    label: "Apple Icon 152x152",
    type: "file",
    dir: "logo",
    size: { width: 152, height: 152, maxWidth: 152, maxHeight: 152 },
  },
  {
    name: "appleIcon180",
    label: "Apple Icon 180x180",
    type: "file",
    dir: "logo",
    size: { width: 180, height: 180, maxWidth: 180, maxHeight: 180 },
  },
  {
    name: "androidIcon192",
    label: "Android Icon 192x192",
    type: "file",
    dir: "logo",
    size: { width: 192, height: 192, maxWidth: 192, maxHeight: 192 },
  },
  {
    name: "androidIcon256",
    label: "Android Icon 256x256",
    type: "file",
    dir: "logo",
    size: { width: 256, height: 256, maxWidth: 256, maxHeight: 256 },
  },
  {
    name: "androidIcon384",
    label: "Android Icon 384x384",
    type: "file",
    dir: "logo",
    size: { width: 384, height: 384, maxWidth: 384, maxHeight: 384 },
  },
  {
    name: "androidIcon512",
    label: "Android Icon 512x512",
    type: "file",
    dir: "logo",
    size: { width: 512, height: 512, maxWidth: 512, maxHeight: 512 },
  },
  {
    name: "favicon32",
    label: "Favicon 32x32",
    type: "file",
    dir: "logo",
    size: { width: 32, height: 32, maxWidth: 32, maxHeight: 32 },
  },
  {
    name: "favicon96",
    label: "Favicon 96x96",
    type: "file",
    dir: "logo",
    size: { width: 96, height: 96, maxWidth: 96, maxHeight: 96 },
  },
  {
    name: "favicon16",
    label: "Favicon 16x16",
    type: "file",
    dir: "logo",
    size: { width: 16, height: 16, maxWidth: 16, maxHeight: 16 },
  },
  {
    name: "msIcon144",
    label: "MS Icon 144x144",
    type: "file",
    dir: "logo",
    size: { width: 144, height: 144, maxWidth: 144, maxHeight: 144 },
  },
];

const LogosSection = ({ formData, handleInputChange, handleFileChange }) => {
  const { t } = useTranslation();
  return (
    <div className="grid w-full grid-cols-12 gap-6">
      <div className="col-span-12 lg:col-span-4 ltablet:col-span-4">
        <div className="mt-4 space-y-2">
          <h3 className="text-lg font-medium tracking-wide text-muted-800 dark:text-muted-100">
            {t("Logos")}
          </h3>
          <p className="max-w-xs text-sm text-muted-400">
            {t("Manage the logos for different contexts.")}
          </p>
        </div>
      </div>
      <div className="col-span-12 lg:col-span-7 ltablet:col-span-7">
        <div className="lg:max-w-xl">
          <div className="grid w-full grid-cols-12 gap-x-6 gap-y-4">
            {logoFields.map((field) =>
              renderField({
                field,
                formData,
                handleInputChange,
                handleFileChange,
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogosSection;
