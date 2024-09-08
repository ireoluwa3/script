import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "@/layouts/Minimal";
import MinimalHeader from "@/components/widgets/MinimalHeader";
import Button from "@/components/elements/base/button/Button";
import Card from "@/components/elements/base/card/Card";
import Input from "@/components/elements/form/input/Input";
import { useTranslation } from "next-i18next";
import $fetch from "@/utils/api";
import { toast } from "sonner";
export default function PasswordReset() {
  const { t } = useTranslation();
  const router = useRouter();
  const { token } = router.query;
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async () => {
    if (!token) {
      toast.error(t("Invalid token"));
      return;
    }
    if (!newPassword || !confirmPassword) {
      toast.error(t("Please fill in all fields"));
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error(t("Passwords do not match"));
      return;
    }
    setIsSubmitting(true);
    const { data, error } = await $fetch({
      url: "/api/auth/verify/reset",
      method: "POST",
      body: { token, newPassword },
      silent: false,
    });
    setIsSubmitting(false);
    if (data && !error) {
      router.push("/user");
    }
  };
  return (
    <Layout title={`${t("Reset Password")}`} color="muted">
      <main className="relative min-h-screen">
        <MinimalHeader />
        <div className="flex min-h-screen flex-col items-stretch justify-between">
          <div className="flex flex-grow items-center px-6 py-12 md:px-12">
            <div className="container">
              <div className="columns flex items-center">
                <div className="flex-shrink flex-grow md:p-3">
                  <div className="mx-auto -mt-10 mb-6 max-w-[420px] text-center font-sans">
                    <h1 className="mb-2 text-center font-sans text-3xl font-light leading-tight text-muted-800 dark:text-muted-100">{`${t(
                      "Reset Password"
                    )}`}</h1>
                    <p className="text-center text-sm text-muted-500">{`${t(
                      "Enter your new password"
                    )}`}</p>
                  </div>

                  <Card
                    shape="smooth"
                    color="contrast"
                    className="mx-auto max-w-[420px] p-6 md:p-8 lg:p-10 flex flex-col gap-4"
                  >
                    <Input
                      type="password"
                      icon="lucide:lock"
                      color="default"
                      size="md"
                      placeholder={`${t("New Password")}`}
                      label={`${t("New Password")}`}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <Input
                      type="password"
                      icon="lucide:lock"
                      color="default"
                      size="md"
                      placeholder={`${t("Confirm Password")}`}
                      label={`${t("Confirm Password")}`}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <div className="relative">
                      <div className="my-4 ">
                        <Button
                          type="button"
                          color="primary"
                          variant="solid"
                          shadow="primary"
                          size="md"
                          className="w-full"
                          onClick={handleSubmit}
                          loading={isSubmitting}
                          disabled={isSubmitting}
                        >{`${t("Reset Password")}`}</Button>
                      </div>
                      <div className="text-center">
                        <Link
                          className="text-sm text-muted-400 underline-offset-4 hover:text-primary-500 hover:underline"
                          href="/login"
                        >{`${t("Back to Login")}`}</Link>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
