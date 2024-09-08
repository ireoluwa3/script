import Button from "@/components/elements/base/button/Button";
import Input from "@/components/elements/form/input/Input";
import { memo } from "react";
import { useTranslation } from "next-i18next";
import { useLoginStore } from "@/stores/auth/login";
import { useRouter } from "next/router";

const VerificationFormBase = () => {
  const { t } = useTranslation();
  const {
    verificationCode,
    setVerificationCode,
    handleVerificationSubmit,
    loading,
  } = useLoginStore();
  const router = useRouter();
  return (
    <div>
      <div className="flex flex-col gap-4">
        <Input
          icon="lucide:lock"
          label={t("Verification Code")}
          color="contrast"
          placeholder={t("Enter verification code")}
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
        />
      </div>

      <div className="mt-6">
        <Button
          color="primary"
          size="md"
          className="w-full"
          loading={loading}
          disabled={loading}
          onClick={() => {
            handleVerificationSubmit(router);
          }}
        >
          {t("Verify Email")}
        </Button>
      </div>
    </div>
  );
};
export const VerificationForm = memo(VerificationFormBase);
