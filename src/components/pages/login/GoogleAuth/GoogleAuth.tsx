import { memo } from "react";
import { GoogleAuthProps } from "./GoogleAuth.types";
import Button from "@/components/elements/base/button/Button";
import { Icon } from "@iconify/react";
import { useTranslation } from "next-i18next";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import { useLoginStore } from "@/stores/auth/login";

const GoogleAuthBase = ({}: GoogleAuthProps) => {
  const { t } = useTranslation();
  const { handleGoogleLogin } = useGoogleAuth();
  const { loading } = useLoginStore();
  return (
    <div>
      <Button
        type="button"
        size="md"
        className="w-full"
        onClick={() => handleGoogleLogin()}
        loading={loading}
        disabled={loading}
      >
        <Icon icon="logos:google-icon" className="me-1 h-4 w-4" />
        <span>{t("Sign in with Google")}</span>
      </Button>
    </div>
  );
};

export const GoogleAuth = memo(GoogleAuthBase);
