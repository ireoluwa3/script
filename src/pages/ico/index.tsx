"use client";
import { HeroParallax } from "@/components/ui/HeroParallax";
import Layout from "@/layouts/Default";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import $fetch from "@/utils/api";
import { MashImage } from "@/components/elements/MashImage";
import Input from "@/components/elements/form/input/Input";
import {
  BentoGrid,
  BentoGridItem,
} from "@/components/pages/blog/PostsGrid/BentoCard";
import { Icon } from "@iconify/react";
import ButtonLink from "@/components/elements/base/button-link/ButtonLink";
import { HeaderCardImage } from "@/components/widgets/HeaderCardImage";
import { debounce } from "lodash";
import { Faq } from "@/components/pages/knowledgeBase/Faq";
import { useTranslation } from "next-i18next";
import Card from "@/components/elements/base/card/Card";
import Link from "next/link";
type Project = {
  id: string;
  name: string;
  description: string;
  website: string;
  whitepaper: string;
  image: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
};
const TokenInitialOfferingDashboard = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const fetchIcoProjects = async () => {
    const url = "/api/ext/ico/project";
    const { data, error } = await $fetch({
      url,
      silent: true,
    });
    if (!error) {
      setProjects(data);
    }
  };
  const debouncedFetchIcoProjects = debounce(fetchIcoProjects, 100);
  useEffect(() => {
    if (router.isReady) {
      debouncedFetchIcoProjects();
    }
  }, [router.isReady]);
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <Layout title={t("ICO Projects")} color="muted">
      {projects.length > 3 ? (
        <HeroParallax
          items={projects.map((project) => ({
            title: project.name,
            link: `/ico/project/${project.id}`,
            thumbnail: project.image,
          }))}
          title={
            <>
              <span className="text-primary-500">
                {t("Initial Coin Offering")}
              </span>
              <br />
              {t("Popular Projects")}
            </>
          }
          description={
            <>
              {t(
                "Discover the most popular projects in the crypto space, and invest in the future."
              )}
              <br />
              <ButtonLink
                href="/user/ico/contribution"
                type="button"
                className="mt-5"
                animated={false}
              >
                {t("View Your Contributions")}
                <Icon icon="mdi:chevron-right" className="ml-2 h-5 w-5" />
              </ButtonLink>
            </>
          }
        />
      ) : (
        <div className="mb-5">
          <HeaderCardImage
            title={t("Discover the most popular projects in the crypto space")}
            description="Invest in the future of blockchain technology and be part of the next big thing."
            lottie={{
              category: "cryptocurrency-2",
              path: "payout",
              height: 200,
            }}
            size="lg"
          />
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-5 justify-between items-center">
        <h2 className="text-2xl">
          <span className="text-primary-500">{t("Popular")} </span>
          <span className="text-muted-800 dark:text-muted-200">
            {t("Projects")}
          </span>
        </h2>

        <div className="w-full sm:max-w-xs text-end">
          <Input
            type="text"
            placeholder={t("Search Projects")}
            value={searchTerm}
            onChange={handleSearchChange}
            icon={"mdi:magnify"}
          />
        </div>
      </div>

      <div className="relative my-5">
        <hr className="border-muted-200 dark:border-muted-700" />
        <span className="absolute inset-0 -top-2 text-center font-semibold text-xs text-muted-500 dark:text-muted-400">
          <span className="bg-muted-50 dark:bg-muted-900 px-2">
            {searchTerm ? `Matching "${searchTerm}"` : `All ICO Projects`}
          </span>
        </span>
      </div>
      {filteredProjects.length > 0 ? (
        <div className="grid gird-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredProjects.map((project) => (
            <Link key={project.id} href={`/ico/project/${project.id}`}>
              <Card
                className={
                  "col-span-1 group relative w-full h-full p-3 hover:shadow-lg cursor-pointer hover:border-primary-500 dark:hover:border-primary-400"
                }
              >
                <div className="relative w-full h-[200px] overflow-hidden rounded-lg">
                  <MashImage
                    src={project.image}
                    alt={project.name}
                    className="rounded-md object-cover w-full h-full bg-muted-100 dark:bg-muted-900"
                    fill
                  />
                </div>
                <div className="p-2">
                  <h3
                    className="text-lg font-semibold text-primary-500 dark:text-primary-400
                  "
                  >
                    {project.name}
                  </h3>
                  <div className="flex flex-col gap-1 text-xs">
                    <p className=" text-muted-500 dark:text-muted-400">
                      {project.description.length > 150
                        ? project.description.slice(0, 150) + "..."
                        : project.description}
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-5 py-12">
          <h2 className="text-lg text-muted-800 dark:text-muted-200">
            {t("No Projects Found")}
          </h2>
          <p className="text-muted-500 dark:text-muted-400 text-sm">
            {t("We couldn't find any of the projects you are looking for.")}
          </p>
        </div>
      )}

      <Faq category="ICO" />
    </Layout>
  );
};
export default TokenInitialOfferingDashboard;
