import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "@/layouts/Default";
import Card from "@/components/elements/base/card/Card";
import { useTranslation } from "next-i18next";
import { Icon } from "@iconify/react";
import Avatar from "@/components/elements/base/avatar/Avatar";
import Button from "@/components/elements/base/button/Button";
import { useDashboardStore } from "@/stores/dashboard";
import $fetch from "@/utils/api";
import Heading from "@/components/elements/base/heading/Heading";
import Paragraph from "@/components/elements/base/paragraph/Paragraph";
import ButtonLink from "@/components/elements/base/button-link/ButtonLink";
const Action = () => {
  const { t } = useTranslation();
  const { profile, fetchProfile } = useDashboardStore();
  const router = useRouter();
  const [status, setStatus] = useState<string | null>(null);
  useEffect(() => {
    if (router.isReady) {
      if (!profile) {
        router.push("/blog");
      } else {
        setStatus(profile.author?.status || null);
      }
    }
  }, [profile, router.isReady]);
  const submit = async () => {
    const { error } = await $fetch({
      url: "/api/content/author",
      method: "POST",
    });
    if (!error) {
      await fetchProfile();
      setStatus("PENDING");
    }
  };
  const renderContent = () => {
    switch (status) {
      case "APPROVED":
        return (
          <div className="text-center flex flex-col gap-5 justify-center items-center h-full">
            <Icon
              icon="mdi:check-circle"
              className="text-success-500 h-16 w-16"
            />
            <Heading as="h2" size="lg" weight="medium">
              {t("You are already an author")}
            </Heading>
            <Paragraph className="text-muted-500 dark:text-muted-400">
              {t("Congratulations! You have been approved as an author.")}
            </Paragraph>
            <ButtonLink
              href={`/user/blog/author/${profile?.author?.id}`}
              className="mt-6"
            >
              {t("Go to Author Page")}
            </ButtonLink>
          </div>
        );
      case "REJECTED":
        return (
          <div className="text-center flex flex-col gap-5 justify-center items-center h-full">
            <Icon
              icon="mdi:close-circle"
              className="text-danger-500 h-16 w-16"
            />
            <Heading as="h2" size="lg" weight="medium">
              {t("Your application has been rejected")}
            </Heading>
            <Paragraph className="text-muted-500 dark:text-muted-400">
              {t("Unfortunately, your application has been rejected.")}
            </Paragraph>
            <ButtonLink href="/blog" className="mt-6">
              {t("Back to Blog")}
            </ButtonLink>
          </div>
        );
      case "PENDING":
        return (
          <div className="text-center flex flex-col gap-5 justify-center items-center h-full">
            <Icon icon="mdi:clock" className="text-warning-500 h-16 w-16" />
            <Heading as="h2" size="lg" weight="medium">
              {t("Your application is pending")}
            </Heading>
            <Paragraph className="text-muted-500 dark:text-muted-400">
              {t("Your application is currently under review.")}
            </Paragraph>
            <ButtonLink href="/blog" className="mt-6">
              {t("Back to Blog")}
            </ButtonLink>
          </div>
        );
      case null:
      default:
        return (
          <div className="text-center flex flex-col gap-5 justify-center items-center h-full">
            <Avatar className="mx-auto" size="xl" src="/img/avatars/10.svg" />
            <div className="mx-auto max-w-xs text-center">
              <Heading as="h2" size="md" weight="medium" className="mt-4">
                {t("Application for")} {process.env.NEXT_PUBLIC_SITE_NAME}{" "}
                {t("Authorship Program")}
              </Heading>
            </div>
            <div className="mx-auto max-w-sm">
              <Card className="p-6">
                <Heading
                  as="h3"
                  size="xs"
                  weight="medium"
                  className="text-muted-400 mb-2 !text-[0.65rem] uppercase"
                >
                  {t("Note from Editorial Team")}
                </Heading>
                <Paragraph
                  size="xs"
                  className="text-muted-500 dark:text-muted-400"
                >
                  {t(
                    "Dear Applicant, We have noticed your interest in contributing to our platform. Due to the increasing volume of content, we are currently expanding our team of authors. We'd be delighted to consider you for this role."
                  )}
                </Paragraph>
              </Card>

              <div className="mt-6 flex items-center justify-between gap-2">
                <ButtonLink className="w-full" href="/blog">
                  {t("Decline")}
                </ButtonLink>
                <Button color="primary" className="w-full" onClick={submit}>
                  {t("Accept")}
                </Button>
              </div>
            </div>
          </div>
        );
    }
  };
  return (
    <Layout title={t("Action")} color="muted">
      <div className="flex items-center justify-center py-8 text-muted-800 dark:text-muted-200">
        <div className="mx-auto w-full max-w-4xl">
          <Card color={"contrast"}>
            <div className="divide-muted-200 dark:divide-muted-700 grid divide-y sm:grid-cols-2 sm:divide-x sm:divide-y-0">
              <div className="flex flex-col p-8">{renderContent()}</div>
              <div>
                <div className="flex flex-col p-8">
                  <Heading as="h2" size="md" weight="medium" className="mt-4">
                    {t("Onboarding Guidelines")}
                  </Heading>
                  <Paragraph
                    size="xs"
                    className="text-muted-500 dark:text-muted-400 max-w-xs"
                  >
                    {t(
                      "Please review the following guidelines carefully before accepting this invitation."
                    )}
                  </Paragraph>
                  <div className="mt-6">
                    <ul className="space-y-6">
                      <li className="flex gap-3">
                        <div className="border-muted-200 dark:border-muted-600 dark:bg-muted-700 shadow-muted-300/30 dark:shadow-muted-800/20 flex h-9 w-9 items-center justify-center rounded-full border bg-white shadow-xl">
                          <Icon
                            icon="fa-solid:gem"
                            className="text-warning-500 h-4 w-4"
                          />
                        </div>
                        <div>
                          <Heading as="h3" size="sm" weight="medium">
                            {t("Content Quality")}
                          </Heading>
                          <Paragraph
                            size="xs"
                            className="text-muted-500 dark:text-muted-400 max-w-[210px]"
                          >
                            {t(
                              "Ensure your articles meet our editorial standards for accuracy, depth, and quality."
                            )}
                          </Paragraph>
                        </div>
                      </li>
                      <li className="flex gap-3">
                        <div className="border-muted-200 dark:border-muted-600 dark:bg-muted-700 shadow-muted-300/30 dark:shadow-muted-800/20 flex h-9 w-9 items-center justify-center rounded-full border bg-white shadow-xl">
                          <Icon
                            icon="lucide:check"
                            className="text-success-500 h-4 w-4"
                          />
                        </div>
                        <div>
                          <Heading as="h3" size="sm" weight="medium">
                            {t("Plagiarism")}
                          </Heading>
                          <Paragraph
                            size="xs"
                            className="text-muted-500 dark:text-muted-400 max-w-[210px]"
                          >
                            {t(
                              "Plagiarism is strictly prohibited. All content must be original and properly cited."
                            )}
                          </Paragraph>
                        </div>
                      </li>
                      <li className="flex gap-3">
                        <div className="border-muted-200 dark:border-muted-600 dark:bg-muted-700 shadow-muted-300/30 dark:shadow-muted-800/20 flex h-9 w-9 items-center justify-center rounded-full border bg-white shadow-xl">
                          <Icon
                            icon="fluent:prohibited-20-regular"
                            className="text-danger-500 h-4 w-4"
                          />
                        </div>
                        <div>
                          <Heading as="h3" size="sm" weight="medium">
                            {t("Prohibited Content")}
                          </Heading>
                          <Paragraph
                            size="xs"
                            className="text-muted-500 dark:text-muted-400 max-w-[210px]"
                          >
                            {t(
                              "Content that includes hate speech, harassment, violence, or explicit material is strictly prohibited."
                            )}
                          </Paragraph>
                        </div>
                      </li>
                      <li className="flex gap-3">
                        <div className="border-muted-200 dark:border-muted-600 dark:bg-muted-700 shadow-muted-300/30 dark:shadow-muted-800/20 flex h-9 w-9 items-center justify-center rounded-full border bg-white shadow-xl">
                          <Icon
                            icon="healthicons:communication-outline"
                            className="text-info-500 h-4 w-4"
                          />
                        </div>
                        <div>
                          <Heading as="h3" size="sm" weight="medium">
                            {t("Communication")}
                          </Heading>
                          <Paragraph
                            size="xs"
                            className="text-muted-500 dark:text-muted-400 max-w-[210px]"
                          >
                            {t(
                              "Maintain open and clear communication with the editorial team."
                            )}
                          </Paragraph>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};
export default Action;
