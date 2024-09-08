import Link from "next/link";
import Layout from "@/layouts/Minimal";
import MinimalHeader from "@/components/widgets/MinimalHeader";
import Button from "@/components/elements/base/button/Button";
import Card from "@/components/elements/base/card/Card";
import Input from "@/components/elements/form/input/Input";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import $fetch from "@/utils/api";
import { toast } from "sonner";
export default function RecoverPassword() {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const handleSubmit = async () => {
    if (!email) {
      toast.error(t("Please enter your email address"));
      return;
    }
    setIsSubmitting(true);
    const { data, error, validationErrors } = await $fetch({
      url: "/api/auth/reset",
      method: "POST",
      body: { email },
      silent: false, // Ensure silent is false to enable toast notifications
    });
    if (data && !error) {
      setEmail("");
    } else {
      if (validationErrors) {
        for (const key in validationErrors) {
          toast.error(validationErrors[key]);
        }
      }
    }
    setIsSubmitting(false);
  };
  return (
    <Layout title={`${t("Forgot Password")}`} color="muted">
      <main className="relative min-h-screen">
        <MinimalHeader />
        <div className="flex min-h-screen flex-col items-stretch justify-between">
          <div className="flex flex-grow items-center px-6 py-12 md:px-12">
            <div className="container">
              <div className="columns flex items-center">
                <div className="flex-shrink flex-grow md:p-3">
                  <div className="mx-auto -mt-10 mb-6 max-w-[420px] text-center font-sans">
                    <h1 className="mb-2 text-center font-sans text-3xl font-light leading-tight text-muted-800 dark:text-muted-100">{`${t(
                      "Recover Password"
                    )}`}</h1>
                    <p className="text-center text-sm text-muted-500">{`${t(
                      "Enter your email address to reset your password"
                    )}`}</p>
                  </div>

                  <Card
                    shape="smooth"
                    color="contrast"
                    className="mx-auto max-w-[420px] p-6 md:p-8 lg:p-10"
                  >
                    <div>
                      <Input
                        icon="lucide:mail"
                        color="default"
                        size="md"
                        placeholder={`${t("Ex: johndoe@gmail.com")}`}
                        label={`${t("Email Address")}`}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
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
