import React, { useEffect, useState } from "react";
import lz from "lzutf8";
import Layout from "@/layouts/Nav";
import $fetch from "@/utils/api";
import { useRouter } from "next/router";
import { ContentProvider } from "@/components/builder";
import { DEFAULT_TEMPLATE } from "@/components/builder/editor/Editor";

const BuilderComponent = () => {
  const [pageReady, setPageReady] = useState(false);
  const [initialJson, setInitialJson] = useState<any>(null);
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  const loadState = async () => {
    const { data, error } = await $fetch({
      url: "/api/content/page",
      silent: true,
    });
    if (!error) {
      const page = data.find((p: any) => p.slug === "frontend");
      if (page && page.content) {
        const { content } = page;
        try {
          const json = lz.decompress(lz.decodeBase64(content));
          setInitialJson(json);
        } catch (error) {
          console.error("Error parsing JSON", error);
          setInitialJson(DEFAULT_TEMPLATE);
        }
        setPageReady(true);
      }
    }
  };

  useEffect(() => {
    if (router.isReady) {
      loadState();
    }
  }, [router.isReady]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // or a loading spinner
  }

  return (
    <Layout horizontal transparent>
      {pageReady && <ContentProvider data={initialJson} />}
    </Layout>
  );
};

BuilderComponent.displayName = "BuilderComponent";
export default BuilderComponent;
