import { useState } from "react";
import { useRouter } from "next/router";
import Button from "@/components/elements/base/button/Button";
import Card from "@/components/elements/base/card/Card";
import Input from "@/components/elements/form/input/Input";
import { useTranslation } from "next-i18next";
import $fetch from "@/utils/api";
import { toast } from "sonner";
import Link from "next/link";
import { MashImage } from "@/components/elements/MashImage";
import { Icon } from "@iconify/react";
import { Lottie } from "@/components/elements/base/lottie";
import { useDashboardStore } from "@/stores/dashboard";
import IconButton from "@/components/elements/base/button-icon/IconButton";
import { AnimatedTooltip } from "@/components/elements/base/tooltips/AnimatedTooltip";
const TwoFactorBase = () => {
  const { t } = useTranslation();
  const { profile, updateProfile2FA } = useDashboardStore() as any;
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [secret, setSecret] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [step, setStep] = useState(1);
  const [type, setType] = useState(""); // No default type initially
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [qrCode, setQrCode] = useState(""); // For APP type
  const [sentOtpType, setSentOtpType] = useState(""); // For SMS and EMAIL types
  const handleGenerateOtp = async (selectedType) => {
    setType(selectedType);
    const requestBody: Record<string, any> = { type: selectedType };
    if (selectedType === "SMS") requestBody.phoneNumber = phoneNumber;
    setIsGenerating(true);
    const { data, error, validationErrors } = await $fetch({
      url: "/api/auth/otp/generate",
      method: "POST",
      body: requestBody,
      silent: selectedType === "APP",
    });
    if (data && !error) {
      setSecret(data.secret);
      if (data.qrCode) setQrCode(data.qrCode);
      if (["SMS"].includes(type)) setSentOtpType(type);
      setStep(2);
    } else {
      if (validationErrors) {
        for (const key in validationErrors) {
          toast.error(validationErrors[key]);
        }
      }
    }
    setIsGenerating(false);
  };
  const handleResendOtp = async () => {
    setIsResending(true);
    const { data, error } = await $fetch({
      url: "/api/auth/otp/resend",
      method: "POST",
      body: { secret, type },
      silent: false,
    });
    setIsResending(false);
  };
  const handleVerifyOtp = async () => {
    if (!otp) {
      toast.error(t("Please enter the OTP"));
      return;
    }
    setIsSubmitting(true);
    const { data, error } = await $fetch({
      url: "/api/auth/otp/verify",
      method: "POST",
      body: { otp, secret, type },
      silent: false,
    });
    setIsSubmitting(false);
    if (data && !error) {
      router.push("/user");
    }
  };
  const handleToggleOtp = async (status) => {
    setIsSubmitting(true);
    updateProfile2FA(status);
    setIsSubmitting(false);
  };
  const renderCard = (methodType, path, text, handleClick) => {
    const enabledType = profile?.twoFactor?.type || "";
    const status = profile?.twoFactor?.enabled || false;
    return (
      <Card
        shape="smooth"
        key={methodType}
        color={
          enabledType === methodType
            ? status
              ? "success"
              : "danger"
            : "contrast"
        }
        className={`p-6 flex flex-col items-center ${
          enabledType === methodType || isGenerating
            ? "cursor-not-allowed relative"
            : "cursor-pointer"
        }`}
        onClick={
          enabledType === methodType || isGenerating ? null : handleClick
        }
      >
        {enabledType === methodType && (
          <div className="absolute top-0 right-0 mt-2 mr-2">
            <AnimatedTooltip
              content={status ? t("Disable 2FA") : t("Enable 2FA")}
            >
              <IconButton
                type="button"
                color={status ? "danger" : "success"}
                variant="outlined"
                shadow={status ? "danger" : "success"}
                size="sm"
                onClick={() => handleToggleOtp(!status)}
                disabled={isGenerating}
              >
                <Icon
                  icon={status ? "mdi:close" : "mdi:check"}
                  className="w-4 h-4"
                />
              </IconButton>
            </AnimatedTooltip>
          </div>
        )}
        <Lottie
          category="otp"
          path={path}
          classNames="mx-auto max-w-[160px]"
          max={path === "mobile-verfication" ? 2 : undefined}
        />
        <p className="text-center text-sm text-muted-800 dark:text-muted-200 mb-4">
          {t(text)}
        </p>
      </Card>
    );
  };
  const render2FACards = () => {
    const methods: any[] = [];
    if (process.env.NEXT_PUBLIC_2FA_APP_STATUS === "true") {
      methods.push(
        renderCard("APP", "app-verfication", "Google Authenticator", () =>
          handleGenerateOtp("APP")
        )
      );
    }
    if (process.env.NEXT_PUBLIC_2FA_SMS_STATUS === "true") {
      methods.push(
        renderCard("SMS", "mobile-verfication", "Receive OTP via SMS", () => {
          setType("SMS");
          setStep(2);
        })
      );
    }
    if (process.env.NEXT_PUBLIC_2FA_EMAIL_STATUS === "true") {
      methods.push(
        renderCard("EMAIL", "email-verfication", "Receive OTP via Email", () =>
          handleGenerateOtp("EMAIL")
        )
      );
    }
    return (
      <div className="flex justify-center">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 lg:grid-cols-3">
          {methods}
        </div>
      </div>
    );
  };
  if (isGenerating) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center space-y-4">
          <Icon
            icon="mdi:loading"
            className="h-12 w-12 animate-spin text-primary-500"
          />
          <p className="text-xl text-primary-500">{t("Generating OTP...")}</p>
        </div>
      </div>
    );
  }
  return (
    <>
      <div className="flex flex-grow items-center px-6 py-12 md:px-12">
        <div className="container">
          <div className="columns flex items-center">
            <div className="flex-shrink flex-grow md:p-3">
              <div className="mx-auto -mt-10 mb-6 max-w-[420px] text-center font-sans">
                <h1 className="mb-2 text-center font-sans text-3xl font-light leading-tight text-muted-800 dark:text-muted-100">
                  {t("Enable Two-Factor Authentication")}
                </h1>
                <p className="text-center text-sm text-muted-500">
                  {step === 1
                    ? t("Choose the type of 2FA to enable")
                    : t("Enter the OTP sent to your phone to enable 2FA")}
                </p>
              </div>

              {step === 1 ? (
                render2FACards()
              ) : (
                <Card
                  shape="smooth"
                  color="contrast"
                  className="mx-auto max-w-[420px] p-6 md:p-8 lg:p-10 flex flex-col gap-4"
                >
                  {type === "APP" && qrCode && (
                    <div className="text-center">
                      <div className="flex justify-center p-4">
                        <MashImage
                          src={qrCode}
                          alt="QR Code"
                          width={250}
                          height={250}
                        />
                      </div>
                      <p className="text-muted-500">
                        {t("Scan this QR code with your authenticator app")}
                      </p>
                    </div>
                  )}
                  {type === "SMS" && (
                    <div>
                      <Input
                        autoComplete="tel"
                        icon="lucide:phone"
                        color="default"
                        size="lg"
                        placeholder={t("Enter your phone number for SMS OTP")}
                        label={t("Phone Number")}
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                      />
                    </div>
                  )}
                  <Input
                    icon="lucide:lock"
                    color="default"
                    size="lg"
                    placeholder={t("Enter OTP")}
                    label={t("OTP")}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />

                  <div className="relative">
                    {["SMS"].includes(type) && sentOtpType !== type && (
                      <div className="my-4">
                        <Button
                          type="button"
                          color="primary"
                          variant="solid"
                          shadow="primary"
                          size="lg"
                          className="w-full"
                          onClick={() => handleGenerateOtp(type)}
                          loading={isSubmitting}
                          disabled={isSubmitting}
                        >
                          {t("Send OTP")}
                        </Button>
                      </div>
                    )}
                    {(["SMS"].includes(type) && sentOtpType === type) ||
                      (["APP", "EMAIL"] && (
                        <div className="my-4">
                          <Button
                            type="button"
                            color="primary"
                            variant="solid"
                            shadow="primary"
                            size="lg"
                            className="w-full"
                            onClick={handleVerifyOtp}
                            loading={isSubmitting}
                            disabled={isSubmitting}
                          >
                            {t("Verify OTP")}
                          </Button>
                        </div>
                      ))}
                    {["EMAIL", "SMS"].includes(type) &&
                      sentOtpType === type && (
                        <div className="my-4">
                          <Button
                            type="button"
                            color="primary"
                            variant="solid"
                            shadow="primary"
                            size="lg"
                            className="w-full"
                            onClick={handleResendOtp}
                            loading={isResending}
                            disabled={isResending}
                          >
                            {t("Resend OTP")}
                          </Button>
                        </div>
                      )}

                    <div className="text-center flex justify-between items-center mt-10">
                      <Link
                        className="text-sm text-muted-400 underline-offset-4 hover:text-primary-500 hover:underline flex items-center justify-center"
                        href="/user/profile"
                      >
                        <Icon icon="mdi:cancel" className="mr-2" />
                        {t("Cancel")}
                      </Link>
                      <div
                        className="text-sm text-muted-400 underline-offset-4 hover:text-primary-500 hover:underline flex items-center justify-center cursor-pointer"
                        onClick={() => {
                          setStep(1);
                          setOtp("");
                          setSecret("");
                        }}
                      >
                        <Icon icon="akar-icons:arrow-left" className="mr-2" />
                        {t("Change Method")}
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              <div className="mt-8 text-center">
                <p className="text-muted-500 text-sm">
                  {t("You can enable or disable 2FA at any time")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export const TwoFactor = TwoFactorBase;
