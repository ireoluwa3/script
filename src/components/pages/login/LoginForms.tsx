import Button from "@/components/elements/base/button/Button";
import Checkbox from "@/components/elements/form/checkbox/Checkbox";
import Input from "@/components/elements/form/input/Input";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { memo, useState } from "react";
import { useTranslation } from "next-i18next";
import { useLoginStore } from "@/stores/auth/login";
import { useRouter } from "next/router";
import { GoogleAuth } from "./GoogleAuth";
import { GoogleOAuthProvider } from "@react-oauth/google";

const googleAuthStatus =
  process.env.NEXT_PUBLIC_GOOGLE_AUTH_STATUS === "true" || false;
export const googleClientId = process.env
  .NEXT_PUBLIC_GOOGLE_CLIENT_ID as string;

const LoginFormsBase = () => {
  const { t } = useTranslation();
  const {
    email,
    setEmail,
    password,
    setPassword,
    handleSubmit,
    loading,
    errors,
  } = useLoginStore();
  const [showPassword, setShowPassword] = useState(false); // New state for password visibility

  const router = useRouter();
  return (
    <>
      {googleClientId && googleAuthStatus && (
        <>
          <GoogleOAuthProvider clientId={googleClientId}>
            <GoogleAuth />
          </GoogleOAuthProvider>
          <div className="relative">
            <hr className="my-8 w-full border-muted-300 dark:border-muted-800" />
            <div className="absolute inset-x-0 -top-3 mx-auto text-center">
              <span className="bg-white px-4 py-1 font-sans text-sm text-muted-400 dark:bg-muted-900">
                {t("or sign in with email")}
              </span>
            </div>
          </div>
        </>
      )}
      <div>
        <div className="space-y-4">
          <Input
            icon="lucide:mail"
            label={t("Email address")}
            color="muted"
            placeholder={t("ex: johndoe@gmail.com")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors["email"]}
          />

          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"} // Conditionally change the input type
              icon="lucide:lock"
              label={t("Password")}
              color="muted"
              placeholder=""
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors["password"]}
            />
            <button
              type="button"
              className="absolute right-4 top-[34px] font-sans" // Adjust the position as needed
              onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
            >
              <Icon
                icon={showPassword ? "lucide:eye" : "lucide:eye-off"}
                className="w-4 h-4 text-muted-400 hover:text-primary-500 dark:text-muted-500 dark:hover:text-primary-500"
              />
            </button>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center">
            <Checkbox
              id="remember-me"
              label={t("Remember me")}
              shape="full"
              color="primary"
            />
          </div>

          <div className="text-sm leading-5">
            <Link
              href="/forgot"
              className="font-medium text-primary-600 underline-offset-4 transition duration-150 ease-in-out hover:text-primary-500 hover:underline focus:underline focus:outline-none"
            >
              {t("Forgot your password")}
            </Link>
          </div>
        </div>

        <div className="mt-6">
          <Button
            color="primary"
            size="md"
            className="w-full"
            loading={loading}
            disabled={loading}
            onClick={() => handleSubmit(router)}
          >
            {t("Sign in")}
          </Button>
        </div>
      </div>

      <hr className="my-6 w-full border-muted-300 dark:border-muted-800" />

      <p className="mt-8 space-x-2 font-sans text-sm leading-5 text-muted-600 dark:text-muted-400">
        <span>{t("Need an account")}</span>
        <Link
          href="/register"
          className="font-medium text-primary-600 underline-offset-4 transition duration-150 ease-in-out hover:text-primary-500 hover:underline focus:underline focus:outline-none"
        >
          {t("Create an account")}
        </Link>
      </p>
    </>
  );
};
export const LoginForms = memo(LoginFormsBase);
