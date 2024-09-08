import { VerificationForm } from "./VerificationForm";
import { TwoFactorForm } from "./TwoFactorForm";
import { LoginForms } from "./LoginForms";
import { useLoginStore } from "@/stores/auth/login";

const FormContentBase = () => {
  const { isVerificationStep, is2FAVerificationStep } = useLoginStore();

  if (isVerificationStep) {
    return <VerificationForm />;
  } else if (is2FAVerificationStep) {
    return <TwoFactorForm />;
  } else {
    return <LoginForms />;
  }
};

export const FormContent = FormContentBase;
