import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import Layout from "@/layouts/Default";
import Card from "@/components/elements/base/card/Card";
import { useTranslation } from "next-i18next";
import { BackButton } from "@/components/elements/base/button/BackButton";
import { Icon } from "@iconify/react";
import Button from "@/components/elements/base/button/Button";
import Modal from "@/components/elements/base/modal/Modal";
import IconButton from "@/components/elements/base/button-icon/IconButton";
import $fetch from "@/utils/api";
import { debounce } from "lodash";
import Tag from "@/components/elements/base/tag/Tag";
import ImagePortal from "@/components/elements/imagePortal";
import { MashImage } from "@/components/elements/MashImage";

type KYC = {
  data: {
    firstName: string;
    daw: string;
    documents: {
      documentPassport: {
        front: string;
        selfie: string;
      };
      documentDriversLicense: {
        front: string;
        selfie: string;
      };
      documentIdCard: {
        front: string;
        back: string;
        selfie: string;
      };
    };
    customFields: {
      title: string;
      value: string;
      type: string;
    }[];
  };
  id: string;
  userId: string;
  templateId: string;
  status: string;
  level: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  user: {
    profile: {
      location: {
        address: string;
        country: string;
        city: string;
        zip: string;
      };
    };
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    createdAt: string;
    updatedAt: string;
  };
  template: {
    options: string;
    customOptions: string;
    id: string;
    title: string;
    status: boolean;
  };
};

const DetailItem = ({ label, value }) => (
  <div className="text-sm">
    <span className="text-gray-500 dark:text-gray-400">{label}:</span>{" "}
    <span
      className={
        value
          ? "text-gray-800 dark:text-gray-200"
          : "text-warning-500 dark:text-warning-400"
      }
    >
      {value || "Missing"}
    </span>
  </div>
);
const ImageItem = ({ label, src, openLightbox }) => (
  <div>
    <div className="relative group">
      <div className="absolute top-2 left-2">
        <Tag color="info">{label}</Tag>
      </div>
      <a onClick={() => openLightbox(src)} className="block cursor-pointer">
        <MashImage
          src={src || "/img/placeholder.svg"}
          alt={label}
          className="rounded-lg"
          height={180}
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
          <Icon icon="akar-icons:eye" className="text-white text-3xl" />
        </div>
      </a>
    </div>
  </div>
);
const KycApplicationDetails = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = router.query;
  const [kyc, setKyc] = useState<KYC | null>(null);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [rejectionMessage, setRejectionMessage] = useState(
    "We are sorry, your kyc has been rejected. Please contact support for more information. \n\nRejection reason goes here.  \n\nThank you."
  );
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const getKyc = async () => {
    setIsLoading(true);
    const { data, error } = await $fetch({
      url: `/api/admin/crm/kyc/applicant/${id}`,
      silent: true,
    });
    if (!error) {
      const parsedData = JSON.parse(data.data);
      setKyc({ ...data, data: parsedData });
    }
    setIsLoading(false);
  };
  const debounceGetKyc = debounce(getKyc, 100);
  useEffect(() => {
    if (router.isReady) {
      debounceGetKyc();
    }
  }, [router.isReady]);
  const updateKyc = async (status) => {
    setIsLoading(true);
    const { error } = await $fetch({
      method: "PUT",
      url: `/api/admin/crm/kyc/applicant/${id}`,
      body: {
        status,
        level: (kyc?.level || 0) + 1,
        ...(status === "REJECTED" && { notes: rejectionMessage }),
      },
    });
    if (!error) {
      setKyc(
        (prevKyc) =>
          ({
            ...prevKyc,
            status: status,
            ...(status === "REJECTED" && { notes: rejectionMessage }),
          } as KYC)
      );
      if (status === "REJECTED") {
        setIsRejectOpen(false);
      }
      if (status === "APPROVED") {
        setIsApproveOpen(false);
      }
    }
    setIsLoading(false);
  };
  const statusClass = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "success";
      case "PENDING":
        return "warning";
      case "REJECTED":
        return "danger";
      default:
        return "info";
    }
  };
  const levelClass = (type: number) => {
    switch (type) {
      case 1:
        return "info";
      case 2:
        return "primary";
      case 3:
        return "success";
      default:
        return "info";
    }
  };
  const documentType = useMemo(() => {
    if (kyc) {
      if (kyc.data.documents.documentPassport) {
        return "Passport";
      }
      if (kyc.data.documents.documentDriversLicense) {
        return "Driver's License";
      }
      if (kyc.data.documents.documentIdCard) {
        return "ID Card";
      }
    }
  }, [kyc]);
  const openLightbox = (image: string) => {
    setCurrentImage(image);
    setIsLightboxOpen(true);
  };
  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };
  const fieldNames = {
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
  };
  const renderDetails = () => {
    const options = JSON.parse(kyc?.template?.options || "{}");
    const keys = Object.keys(options).filter(
      (key) =>
        kyc &&
        options[key].enabled &&
        (parseInt(options[key].level) <= kyc.level ||
          parseInt(options[key].level) === kyc.level + 1)
    );
    return (
      <div className="grid gap-2 xs:grid-cols-1 sm:grid-cols-2">
        {keys.map(
          (key) =>
            fieldNames[key] && (
              <DetailItem
                key={key}
                label={fieldNames[key]?.title}
                value={
                  kyc?.data[key] ||
                  (kyc &&
                    (parseInt(options[key].level) === kyc.level + 1
                      ? "Missing"
                      : null))
                }
              />
            )
        )}
      </div>
    );
  };
  const renderDocumentSection = (document) => (
    <div className="grid grid-cols-3 gap-5">
      {document.front && (
        <ImageItem
          label={t("Front")}
          src={document.front}
          openLightbox={openLightbox}
        />
      )}
      {document.selfie && (
        <ImageItem
          label={t("Selfie")}
          src={document.selfie}
          openLightbox={openLightbox}
        />
      )}
      {document.back && (
        <ImageItem
          label={t("Back")}
          src={document.back}
          openLightbox={openLightbox}
        />
      )}
    </div>
  );
  const renderCustomFields = () => {
    const customOptions = JSON.parse(kyc?.template.customOptions || "{}");
    const customKeys = Object.keys(customOptions).filter(
      (key) =>
        (kyc && parseInt(customOptions[key].level) <= kyc.level) ||
        (kyc && parseInt(customOptions[key].level) === kyc.level + 1)
    );
    return (
      <Card className="p-5 border rounded-md dark:border-gray-600">
        <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
          {t("Custom Fields")}:
        </h3>
        <div className="grid gap-5 grid-cols-3 text-md">
          {customKeys.map((key) => {
            const field = customOptions[key];
            const value =
              kyc?.data[key] ||
              (kyc &&
                (parseInt(field.level) === kyc.level + 1 ? "Missing" : null));
            if (field.type === "input" || field.type === "textarea") {
              return (
                <div key={key}>
                  {" "}
                  <span className="text-gray-500 dark:text-gray-400">
                    {t(key)}:
                  </span>{" "}
                  <span
                    className={
                      value
                        ? "text-gray-800 dark:text-gray-200"
                        : "text-warning-500 dark:text-warning-400"
                    }
                  >
                    {value || "Missing"}
                  </span>
                </div>
              );
            }
            if (field.type === "image" || field.type === "file") {
              return (
                <ImageItem
                  key={key}
                  label={t(key)}
                  src={value}
                  openLightbox={openLightbox}
                />
              );
            }
            return null;
          })}
        </div>
      </Card>
    );
  };

  // Check if there are any documents at or below the current level
  const hasDocuments = useMemo(() => {
    if (!kyc) return false;
    const { documents } = kyc.data;
    const levels = [kyc.level, kyc.level - 1];
    return levels.some(
      (level) =>
        documents[`documentPassport`] ||
        documents[`documentDriversLicense`] ||
        documents[`documentIdCard`]
    );
  }, [kyc]);

  // Check if there are any custom fields at or below the current level
  const hasCustomFields = useMemo(() => {
    if (!kyc) return false;
    const customOptions = JSON.parse(kyc?.template.customOptions || "{}");
    const levels = [kyc.level, kyc.level - 1];
    return levels.some((level) =>
      Object.keys(customOptions).some(
        (key) => parseInt(customOptions[key].level) <= level
      )
    );
  }, [kyc]);

  // Inside the return of the component
  return (
    <Layout title={t("KYC Application Details")} color="muted">
      <div className="mx-auto text-gray-800 dark:text-gray-200 max-w-7xl">
        <div className="flex justify-between items-center w-full mb-5">
          <h1 className="text-xl">{t("KYC Application Details")}</h1>
          <BackButton href="/admin/crm/kyc/applicant" />
        </div>

        <div className="flex flex-col gap-5">
          {/* Details Section */}
          {kyc && (
            <>
              <Card className="p-5 border rounded-md dark:border-gray-600">
                {/* Header Section */}
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
                    {t("General Details")}:
                  </h2>
                  <div className="flex items-center xs:flex-col sm:flex-row gap-2">
                    <Tag color={statusClass(kyc?.status)}>{kyc?.status}</Tag>
                    <Tag color={levelClass(kyc?.level)}>
                      {t("Level")} {kyc?.level}
                    </Tag>
                  </div>
                </div>
                {renderDetails()}
              </Card>
            </>
          )}

          {/* Document Upload */}
          {kyc && hasDocuments && (
            <Card className="p-5 border rounded-md dark:border-gray-600">
              <h3 className="text-lg mb-2 text-gray-800 dark:text-gray-200">
                {t("Uploaded Document")}:{" "}
                <span className="font-semibold">{documentType}</span>
              </h3>
              {kyc?.data?.documents?.documentPassport &&
                renderDocumentSection(kyc?.data.documents.documentPassport)}
              {kyc?.data?.documents?.documentDriversLicense &&
                renderDocumentSection(
                  kyc?.data.documents.documentDriversLicense
                )}
              {kyc?.data?.documents?.documentIdCard &&
                renderDocumentSection(kyc?.data.documents.documentIdCard)}
            </Card>
          )}

          {/* Custom Fields */}
          {kyc && hasCustomFields && renderCustomFields()}

          {/* Rejection Notes Section */}
          {kyc?.notes && kyc?.status === "REJECTED" && (
            <Card className="p-5 border rounded-md dark:border-gray-600">
              <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
                {t("Notes")}:
              </h2>
              <p
                className="text-md"
                dangerouslySetInnerHTML={{
                  __html: kyc.notes?.replace(/\n/g, "<br />"),
                }}
              ></p>
            </Card>
          )}

          {/* Approve Kyc Button */}
          {kyc?.status === "PENDING" && (
            <Card className="w-full flex gap-2 xs:flex-col sm:flex-row mb-2 p-5">
              <Button
                color="success"
                className="w-full"
                onClick={() => setIsApproveOpen(true)}
              >
                {t("Approve Kyc")}
              </Button>
              <Button
                color="danger"
                className="w-full"
                onClick={() => setIsRejectOpen(true)}
              >
                {t("Reject Kyc")}
              </Button>
            </Card>
          )}
        </div>

        {/* Approve Kyc Modal */}
        <Modal open={isApproveOpen} size="lg">
          <Card shape="smooth">
            <div className="flex items-center justify-between p-4 md:p-6">
              <h3 className="text-lg font-medium text-muted-900 dark:text-white">
                {t("Approve Kyc")}
              </h3>
              <IconButton
                size="sm"
                shape="full"
                onClick={() => setIsApproveOpen(false)}
              >
                <Icon icon="lucide:x" className="h-4 w-4" />
              </IconButton>
            </div>
            <div className="p-4 md:p-6 text-md">
              <p>
                {t(
                  "Are you sure you want to approve this kyc? This action cannot be undone."
                )}
              </p>
            </div>
            <div className="p-4 md:p-6">
              <div className="flex gap-x-2 justify-end">
                <Button
                  color="success"
                  onClick={() => updateKyc("APPROVED")}
                  disabled={isLoading}
                  loading={isLoading}
                >
                  {t("Approve")}
                </Button>
              </div>
            </div>
          </Card>
        </Modal>

        {/* Reject Kyc Modal */}
        <Modal open={isRejectOpen} size="lg">
          <Card shape="smooth">
            <div className="flex items-center justify-between p-4 md:p-6">
              <h3 className="text-lg font-medium text-muted-900 dark:text-white">
                {t("Reject Kyc")}
              </h3>
              <IconButton
                size="sm"
                shape="full"
                onClick={() => setIsRejectOpen(false)}
              >
                <Icon icon="lucide:x" className="h-4 w-4" />
              </IconButton>
            </div>
            <div className="p-4 md:p-6 text-md">
              <textarea
                value={rejectionMessage}
                onChange={(e) => setRejectionMessage(e.target.value)}
                rows={10}
                placeholder={t("Enter rejection reason")}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="p-4 md:p-6">
              <div className="flex gap-x-2 justify-end">
                <Button
                  color="danger"
                  onClick={() => updateKyc("REJECTED")}
                  disabled={isLoading}
                  loading={isLoading}
                >
                  {t("Reject")}
                </Button>
              </div>
            </div>
          </Card>
        </Modal>

        {isLightboxOpen && (
          <ImagePortal src={currentImage} onClose={closeLightbox} />
        )}
      </div>
    </Layout>
  );
};
export default KycApplicationDetails;
export const permission = "Access KYC Application Management";
