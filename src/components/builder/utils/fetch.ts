import lz from "lzutf8";
import $fetch from "@/utils/api";
import { debounce } from "lodash";
import { DEFAULT_TEMPLATE } from "../editor/Editor";

export const getThemeUrl = (themeFolder: string) => {
  return `/api/admin/content/editor?type=theme&name=${themeFolder}`;
};

export const uploadFile = async (file: File) => {
  const { data, error } = await $fetch({
    url: `/api/upload`,
    method: "POST",
    body: [],
  });
  return data;
};

export const loadTemplate = async () => {
  const { data, error } = await $fetch({
    silent: true,
    url: `/api/admin/content/editor?type=data&path=/&ext=json`,
  });

  if (data && !error) {
    if (typeof data === "string" && data !== "") {
      try {
        const content = lz.decompress(lz.decodeBase64(data));
        const parsed = JSON.parse(content);
        return parsed;
      } catch (error) {
        return DEFAULT_TEMPLATE;
      }
    } else {
      return DEFAULT_TEMPLATE;
    }
  }
};

export const saveTemplate = async (state: any) => {
  await $fetch({
    method: "POST",
    silent: true,
    url: `/api/admin/content/editor`,
    body: {
      content: state.serialize(),
      path: "/",
    },
  });
};

export const saveTemplateDebounce = debounce(saveTemplate, 100);
