import Button from "@/components/elements/base/button/Button";
import Input from "@/components/elements/form/input/Input";
import { Icon } from "@iconify/react";
import { memo } from "react";
import { useTranslation } from "next-i18next";
import { useLoginStore } from "@/stores/auth/login";
import { useRouter } from "next/router";

const TwoFactorFormBase = () => {
  const { t } = useTranslation();
  const {
    otp,
    setOtp,
    twoFactorType,
    handle2FASubmit,
    handleResendOtp,
    resendCooldown,
    loading,
  } = useLoginStore();
  const router = useRouter();

  return (
    <div>
      <div className="flex flex-col gap-4">
        <Input
          icon="lucide:lock"
          label={t("2FA Code")}
          color="contrast"
          placeholder={t("Enter 2FA code")}
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        <p className="text-sm text-muted-500">
          {t(`Use the OTP sent to your ${twoFactorType.toLowerCase()}`)}
        </p>
      </div>

      <div className="mt-6">
        <Button
          color="primary"
          size="md"
          className="w-full"
          loading={loading}
          disabled={loading}
          onClick={() => {
            handle2FASubmit(router);
          }}
        >
          {t("Verify 2FA")}
        </Button>
      </div>
      <div>
        {twoFactorType !== "APP" && (
          <span className="mt-4 text-sm text-muted-400 dark:text-muted-600 flex items-center justify-between">
            <span>{t("Didn't receive the OTP?")}</span>
            <span
              className={`text-sm flex items-center justify-center gap-1 ${
                resendCooldown > 0 || loading
                  ? "text-muted-400 dark:text-muted-600 cursor-not-allowed"
                  : "text-primary-600 cursor-pointer hover:text-primary-500"
              }`}
              onClick={() => {
                if (resendCooldown > 0 || loading) return;
                handleResendOtp();
              }}
            >
              <Icon icon="mdi:refresh" className="me-1" />
              {resendCooldown > 0
                ? `${t("Resend OTP in")} ${resendCooldown}s`
                : t("Resend OTP")}
            </span>
          </span>
        )}
      </div>
    </div>
  );
};
export const TwoFactorForm = memo(TwoFactorFormBase);
