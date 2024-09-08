import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Card from "@/components/elements/base/card/Card";
import { Icon } from "@iconify/react";
import $fetch from "@/utils/api";
import { Faq } from "@/components/pages/knowledgeBase/Faq";
import ButtonLink from "@/components/elements/base/button-link/ButtonLink";
import { useDashboardStore } from "@/stores/dashboard";
import { useTranslation } from "next-i18next";
import { debounce } from "lodash";
const statusClassMap = {
  APPROVED:
    "text-success-700 bg-success-100 border border-success-300 rounded-lg dark:bg-muted-900 dark:border-success-800 dark:text-success-400",
  PENDING:
    "text-info-700 bg-info-100 border border-info-300 rounded-lg dark:bg-muted-900 dark:border-info-800 dark:text-info-400",
  REJECTED:
    "text-danger-700 bg-danger-100 border border-danger-300 rounded-lg dark:bg-muted-900 dark:border-danger-800 dark:text-danger-400",
  MUTED:
    "text-muted-900 bg-muted-100 border border-muted-300 rounded-lg dark:bg-muted-900 dark:border-muted-700 dark:text-muted-400",
};
const IdentityVerification: React.FC = () => {
  const { t } = useTranslation();
  const { profile } = useDashboardStore();
  const router = useRouter();
  const [lastLevel, setLastLevel] = useState(0);
  const [level, setLevel] = useState(0);
  const [statusClass, setStatusClass] = useState(statusClassMap["MUTED"]);
  const [statusIcon, setStatusIcon] = useState("");

  const checkStatus = async () => {
    const kycLevel = parseInt(profile?.kyc?.level || "0");
    setLevel(kycLevel);
    setStatusClass(statusClassMap[profile?.kyc?.status || "MUTED"]);
    setStatusIcon(() => {
      switch (profile?.kyc?.status) {
        case "APPROVED":
          return "line-md:confirm";
        case "PENDING":
          return "line-md:loading-alt-loop";
        case "REJECTED":
          return "line-md:close";
        default:
          return "";
      }
    });
  };

  const fetchActiveKycTemplate = async () => {
    const { data, error } = await $fetch({
      url: "/api/user/kyc/template",
      silent: true,
    });
    if (!error) {
      const options = JSON.parse(data.options);
      const customFields = JSON.parse(data.customOptions);
      updateLastLevel({ ...options, ...customFields });
    }
  };

  const debouncedFetchActiveKycTemplate = debounce(fetchActiveKycTemplate, 100);

  useEffect(() => {
    if (router.isReady && profile) {
      checkStatus();
      debouncedFetchActiveKycTemplate();
    }
  }, [router.isReady, profile]);

  const updateLastLevel = (fields: Record<string, any>) => {
    let maxLevel = 0;
    for (const key in fields) {
      if (parseInt(fields[key].level) > maxLevel) {
        maxLevel = parseInt(fields[key].level);
      }
    }
    setLastLevel(maxLevel);
  };
  const getKycApplicationRoute = (state: string) => {
    return `/user/profile/kyc?state=${state}&l=${
      level + (state === "new" ? 1 : 0)
    }`;
  };
  const verificationLevel =
    lastLevel > level ? `Verified Level ${level + 1}` : "Verified";
  const kycDesc = profile?.kyc
    ? t("Verify your identity to participate in our platform.")
    : t(
        "To comply with regulations, each participant is required to go through identity verification (KYC/AML) to prevent fraud, money laundering operations, transactions banned under the sanctions regime, or those which fund terrorism. Please complete our fast and secure verification process to participate in our platform."
      );
  const computedLevels = Array.from({ length: lastLevel }, (_, i) => {
    const currentLevel = i + 1;
    return {
      id: currentLevel,
      level: currentLevel,
      name: ["Verified", "Verified Plus", "Verified Pro"][i],
      cssClass:
        level >= currentLevel
          ? level === currentLevel
            ? statusClass
            : statusClassMap["APPROVED"]
          : statusClassMap["MUTED"],
      icon:
        level >= currentLevel
          ? level === currentLevel
            ? statusIcon
            : "line-md:confirm"
          : "",
      showStatus: level >= currentLevel,
    };
  });
  return (
    <>
      <div className="mx-auto text-muted-800 dark:text-muted-200">
        <div className="grid gap-5 xs:grid-cols-1 md:grid-cols-3">
          <div className="xs:col-span-1 md:col-span-2">
            <div className="text-muted-800 dark:text-muted-200 py-5">
              <p className="text-lg">{kycDesc}</p>
            </div>
            <div className="mx-auto">
              {!profile?.kyc ||
              (level === 0 && profile?.kyc?.status !== "PENDING") ? (
                <Card
                  className="px-5 py-10 text-center border-muted-500 rounded"
                  color={"contrast"}
                >
                  <div className="flex flex-col justify-center items-center">
                    <div className="bg-muted-200 text-muted-600 dark:text-muted-300 dark:bg-muted-800 p-4 rounded-full">
                      <Icon
                        icon="system-uicons:files-multi"
                        className="h-10 w-10"
                      />
                    </div>
                    <span className="text-muted-700 dark:text-muted-300 text-2xl font-medium my-5">
                      {t(
                        "You have not submitted your necessary documents to verify your identity. In order to trade in our platform, please verify your identity."
                      )}
                    </span>
                    <p className="text-md">
                      {t(
                        "It would be great if you could submit the form. If you have any questions, please feel free to contact our support team."
                      )}
                    </p>
                    <ButtonLink
                      href={getKycApplicationRoute("new")}
                      color="primary"
                      className="mt-5"
                    >
                      {t("Click here to complete your KYC")}
                    </ButtonLink>
                  </div>
                </Card>
              ) : profile?.kyc?.status === "PENDING" ? (
                <Card
                  className="px-5 py-10 text-center border-info rounded flex items-center"
                  color={"contrast"}
                >
                  <div className="flex flex-col justify-center items-center">
                    <div className="bg-info-100 text-info-700 dark:text-info-400 dark:bg-muted-800 p-4 rounded-full mb-5">
                      <Icon
                        icon="line-md:loading-alt-loop"
                        className="h-16 w-16"
                      />
                    </div>
                    <span className="text-info-500 text-2xl font-medium mb-5">
                      {t("Your identity verification is processing.")}
                    </span>
                    <p className="text-md">
                      {t(
                        "We are still working on your identity verification. Once our team verifies your identity, you will be notified by email."
                      )}
                    </p>
                  </div>
                </Card>
              ) : profile?.kyc?.status === "REJECTED" ? (
                <Card
                  className="px-5 py-10 text-center border-warning rounded"
                  color={"contrast"}
                >
                  <div className="flex flex-col justify-center items-center">
                    <div className="bg-danger-100 text-danger-700 dark:text-danger-400 dark:bg-muted-800 p-4 rounded-full mb-5">
                      <Icon icon="line-md:alert" className="h-12 w-12" />
                    </div>
                    <span className="text-danger-500 text-2xl font-medium mb-5">
                      {t("Sorry! Your application was rejected.")}
                    </span>
                    <p className="text-md">
                      {t(
                        "In our verification process, we found information that is incorrect or missing. Please resubmit the form. In case of any issues with the submission, please contact our support team."
                      )}
                    </p>
                    <ButtonLink
                      href={getKycApplicationRoute("resubmit")}
                      color="primary"
                      className="mt-5"
                    >
                      {t("Submit Again")}
                    </ButtonLink>
                  </div>
                </Card>
              ) : profile?.kyc?.status === "APPROVED" ? (
                <Card
                  className="px-5 py-10 text-center border-success rounded"
                  color={"contrast"}
                >
                  <div className="flex flex-col justify-center items-center">
                    <div className="bg-success-100 text-success-700 dark:text-success-400 dark:bg-muted-800 p-4 rounded-full mb-5">
                      <Icon
                        icon="fluent:shield-task-28-regular"
                        className="h-16 w-16"
                      />
                    </div>
                    <span className="text-success-500 text-2xl font-medium mb-5">
                      {t("Your identity has been verified successfully.")}
                    </span>
                    <p>
                      {t(
                        "One of our team members has verified your identity. Now you can participate in our platform. Thank you."
                      )}
                    </p>
                    {lastLevel > level && (
                      <ButtonLink
                        href={`/user/profile/kyc?state=new&l=${level + 1}`}
                        color="primary"
                        className="mt-5"
                      >
                        {t("Get")} {verificationLevel}
                      </ButtonLink>
                    )}
                  </div>
                </Card>
              ) : null}
            </div>
          </div>
          <Card className="p-5" color={"mutedContrast"}>
            <h4 className="mb-2 text-lg">{t("Verification Levels")}</h4>
            <ul className="space-y-4">
              {computedLevels.map((item) => (
                <li key={item.id}>
                  <Card className={`w-full p-4 ${item.cssClass}`} role="alert">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">
                        {item.level}. {item.name}
                      </h3>
                      {item.showStatus && (
                        <Icon
                          icon={item.icon}
                          color="currentColor"
                          className="h-5 w-5 text-muted-400"
                        />
                      )}
                    </div>
                  </Card>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
      <Faq category="KYC" />
    </>
  );
};
export const KycStatus = IdentityVerification;
