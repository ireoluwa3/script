import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Layout from "@/layouts/Minimal";
import Button from "@/components/elements/base/button/Button";
import Input from "@/components/elements/form/input/Input";
import LogoText from "@/components/vector/LogoText";
import ThemeSwitcher from "@/components/widgets/ThemeSwitcher";
import Heading from "@/components/elements/base/heading/Heading";
import Paragraph from "@/components/elements/base/paragraph/Paragraph";
import ButtonLink from "@/components/elements/base/button-link/ButtonLink";
import Alert from "@/components/elements/base/alert/Alert";
import Checkbox from "@/components/elements/form/checkbox/Checkbox";
import $fetch from "@/utils/api";
import { useDashboardStore } from "@/stores/dashboard";
import Link from "next/link";
import { Icon } from "@iconify/react";
import GoogleLoginButton from "@/components/pages/auth/GoogleLoginButton";

const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string;
const hasGoogleClientId = googleClientId && googleClientId !== "";
const defaultUserPath = process.env.NEXT_PUBLIC_DEFAULT_USER_PATH || "/user";

function validatePassword(password: string): { [key: string]: boolean } {
  return {
    "Has at least 8 characters": password.length >= 8,
    "Has uppercase letters": /[A-Z]/.test(password),
    "Has lowercase letters": /[a-z]/.test(password),
    "Has numbers": /\d/.test(password),
    "Has non-alphanumeric characters": /\W/.test(password),
  };
}

function PasswordValidation({ password }: { password: string }) {
  const conditions = validatePassword(password);
  const isValid = Object.values(conditions).every(Boolean);

  return (
    <Alert
      color={isValid ? "success" : "danger"}
      className="text-sm"
      canClose={false}
    >
      <div className="flex flex-col gap-1">
        {Object.entries(conditions).map(([condition, valid], index) => (
          <div
            key={index}
            className={`flex gap-2 items-center ${
              valid ? "text-green-500" : "text-red-500"
            }`}
          >
            <Icon icon={valid ? "mdi:check-bold" : "mdi:close-thick"} />
            {condition}
          </div>
        ))}
      </div>
    </Alert>
  );
}

export default function Register() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [referral, setReferral] = useState("");
  const [isVerificationStep, setIsVerificationStep] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordTyped, setIsPasswordTyped] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const { setIsFetched, fetchProfile } = useDashboardStore();
  const router = useRouter();
  const { ref, token } = router.query as { ref: string; token: string };

  useEffect(() => {
    if (router.query.ref) {
      setReferral(ref);
    }
    if (router.query.token) {
      setVerificationCode(token);
      handleVerificationSubmit(token);
    }
  }, [router.query]);

  useEffect(() => {
    setIsPasswordValid(
      Object.values(validatePassword(password)).every(Boolean)
    );
  }, [password]);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (!isPasswordTyped) {
      setIsPasswordTyped(true);
    }
  };

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const { data, error, validationErrors } = await $fetch({
      url: "/api/auth/register",
      method: "POST",
      body: { firstName, lastName, email, password, ref: referral },
    });

    setLoading(false);

    if (validationErrors) {
      setErrors(validationErrors);
      return;
    }

    if (data && !error) {
      if (process.env.NEXT_PUBLIC_VERIFY_EMAIL_STATUS === "true") {
        setIsVerificationStep(true);
      } else {
        setIsFetched(false);
        await fetchProfile();
        router.push(defaultUserPath);
      }
    }
  };

  const handleGoogleSuccess = async (tokenResponse: any) => {
    const { access_token } = tokenResponse;
    const { data, error } = await $fetch({
      url: "/api/auth/register/google",
      method: "POST",
      body: { token: access_token, ref: referral },
    });
    if (data && !error) {
      setIsFetched(false);
      await fetchProfile();
      router.push(defaultUserPath);
    }
  };

  const handleGoogleError = (errorResponse: any) => {
    console.error("Google login failed", errorResponse);
  };

  const handleVerificationSubmit = async (verificationToken?: string) => {
    setLoading(true);
    const tokenToVerify = verificationToken || verificationCode;
    const { data, error } = await $fetch({
      url: "/api/auth/verify/email",
      method: "POST",
      body: { token: tokenToVerify },
    });
    setLoading(false);
    if (data && !error) {
      setIsFetched(false);
      await fetchProfile();
      router.push(defaultUserPath);
    }
  };

  return (
    <Layout title={t("Register")} color="muted">
      <main className="relative min-h-screen">
        <div className="flex h-screen flex-col items-center bg-white dark:bg-muted-900 md:flex-row">
          <div className="hidden h-screen w-full bg-indigo-600 md:w-1/2 lg:flex xl:w-2/3 from-primary-900 to-primary-500 i group relative items-center justify-around overflow-hidden bg-gradient-to-tr md:flex">
            <div className="mx-auto max-w-xs text-center">
              <Heading as="h2" weight="medium" className="text-white">
                {t("Have an Account")}?
              </Heading>
              <Paragraph size="sm" className="text-muted-200 mb-3">
                {t(
                  "No need to waste time on this page, let's take you back to your account"
                )}
              </Paragraph>
              <ButtonLink href="/login" shape="curved" className="w-full">
                {t("Login to Account")}
              </ButtonLink>
            </div>
            {/* Additional decorative elements */}
          </div>

          <div className="relative flex h-screen w-full items-center justify-center bg-white px-6 dark:bg-muted-900 md:mx-auto md:w-1/2 md:max-w-md lg:max-w-full lg:px-16 xl:w-1/3 xl:px-12">
            <div className="absolute inset-x-0 top-6 mx-auto w-full max-w-sm px-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Link href="/">
                    <LogoText className="h-6 text-primary-500" />
                  </Link>
                </div>
                <div className="flex items-center justify-end">
                  <ThemeSwitcher />
                </div>
              </div>
            </div>
            <div className="mx-auto w-full max-w-sm px-4">
              <h1 className="mt-12 mb-6 font-sans text-2xl font-light leading-9 text-muted-800 dark:text-muted-100">
                {isVerificationStep
                  ? t("Verify your email")
                  : t("Create a new account")}
              </h1>

              {isVerificationStep ? (
                <form
                  className="mt-6"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleVerificationSubmit();
                  }}
                  method="POST"
                >
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
                      type="submit"
                      color="primary"
                      size="md"
                      className="w-full"
                      loading={loading}
                      disabled={loading}
                    >
                      {t("Verify Email")}
                    </Button>
                  </div>
                </form>
              ) : (
                <>
                  {hasGoogleClientId && (
                    <GoogleOAuthProvider clientId={googleClientId}>
                      <GoogleLoginButton
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                      />
                    </GoogleOAuthProvider>
                  )}

                  <form className="mt-6" onSubmit={handleSubmit} method="POST">
                    <div className="flex flex-col gap-4">
                      <div className="flex gap-4">
                        <Input
                          autoComplete="given-name"
                          label={t("First Name")}
                          color="contrast"
                          placeholder={t("John")}
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          error={errors.firstName}
                        />

                        <Input
                          autoComplete="family-name"
                          label={t("Last Name")}
                          color="contrast"
                          placeholder={t("Doe")}
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          error={errors.lastName}
                        />
                      </div>
                      <Input
                        type="email"
                        icon="lucide:mail"
                        label={t("Email address")}
                        color="contrast"
                        placeholder={t("ex: johndoe@gmail.com")}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={errors.email}
                      />

                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          icon="lucide:lock"
                          label={t("Password")}
                          color="contrast"
                          placeholder=""
                          value={password}
                          onChange={handlePasswordChange}
                          error={errors.password}
                        />
                        <button
                          type="button"
                          className="absolute right-4 top-[34px] font-sans"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          <Icon
                            icon={
                              showPassword ? "lucide:eye" : "lucide:eye-off"
                            }
                            className="w-4 h-4 text-muted-400 hover:text-primary-500 dark:text-muted-500 dark:hover:text-primary-500"
                          />
                        </button>
                      </div>
                      {isPasswordTyped && (
                        <PasswordValidation password={password} />
                      )}
                      {referral && (
                        <Input
                          label={t("Referral Code")}
                          color="contrast"
                          placeholder={t("Referral code")}
                          value={referral}
                          onChange={(e) => setReferral(e.target.value)}
                          readOnly
                          error={errors.ref}
                        />
                      )}
                    </div>

                    <div className="flex items-center mt-4">
                      <Checkbox
                        type="checkbox"
                        id="terms"
                        label={
                          <>
                            {t("I accept the")}{" "}
                            <Link
                              href="/terms-and-conditions"
                              className="font-medium text-primary-600 underline-offset-4 transition duration-150 ease-in-out hover:text-primary-500 hover:underline focus:underline focus:outline-none"
                            >
                              {t("Terms and Conditions")}
                            </Link>
                          </>
                        }
                        checked={acceptedTerms}
                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                        color="primary"
                      />
                    </div>

                    <div className="mt-6">
                      <Button
                        type="submit"
                        color="primary"
                        size="md"
                        className="w-full"
                        loading={loading}
                        disabled={loading || !isPasswordValid || !acceptedTerms}
                      >
                        {t("Sign up")}
                      </Button>
                    </div>
                  </form>

                  <hr className="my-8 w-full border-muted-300 dark:border-muted-800" />

                  <p className="mt-8 space-x-2 font-sans text-sm leading-5 text-muted-600 dark:text-muted-400">
                    <span>{t("Already have an account?")}</span>
                    <Link
                      href="/login"
                      className="font-medium text-primary-600 underline-offset-4 transition duration-150 ease-in-out hover:text-primary-500 hover:underline focus:underline focus:outline-none"
                    >
                      {t("Log in")}
                    </Link>
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
