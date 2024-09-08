import React from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { Icon } from "@iconify/react";
import Button from "@/components/elements/base/button/Button";
import { useTranslation } from "next-i18next";

interface GoogleLoginButtonProps {
  onSuccess: (tokenResponse: any) => void;
  onError: (errorResponse: any) => void;
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({
  onSuccess,
  onError,
}) => {
  const { t } = useTranslation();

  const handleGoogleLogin = useGoogleLogin({
    onSuccess,
    onError,
  });

  return (
    <>
      <div>
        <Button
          type="button"
          size="md"
          className="w-full"
          onClick={() => handleGoogleLogin()}
        >
          <Icon icon="logos:google-icon" className="me-1 h-4 w-4" />
          <span>{t("Sign up with Google")}</span>
        </Button>
      </div>
      <div className="relative">
        <hr className="my-8 w-full border-muted-300 dark:border-muted-800" />
        <div className="absolute inset-x-0 -top-3 mx-auto text-center">
          <span className="bg-white px-4 py-1 font-sans text-sm text-muted-400 dark:bg-muted-900">
            {t("or signup with email")}
          </span>
        </div>
      </div>
    </>
  );
};

export default GoogleLoginButton;
