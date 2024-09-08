import React, { type FC, useState } from "react";
import { Tab } from "@headlessui/react";
import { useTranslation } from "next-i18next";
interface TrackTabsItem {
  id: number;
  title: string;
  date: string;
  commentCount: number;
  shareCount: number;
  href: string;
}
interface TrackTabsProps {
  categories: {
    [key: string]: TrackTabsItem[];
  };
  shape?: "straight" | "rounded" | "smooth" | "curved" | "full";
}
function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}
const TrackTabs: FC<TrackTabsProps> = ({ categories, shape = "smooth" }) => {
  const { t } = useTranslation();
  const [computedCategories] = useState(categories);
  return (
    <div className="relative w-full">
      <Tab.Group>
        <Tab.List
          className={`
          flex space-x-1 bg-muted-100 p-1 dark:bg-muted-900
          ${shape === "rounded" ? "rounded-md" : ""}
          ${shape === "smooth" ? "rounded-lg" : ""}
          ${shape === "curved" ? "rounded-xl" : ""}
          ${shape === "full" ? "rounded-full" : ""}
        `}
        >
          {Object.keys(computedCategories).map((category) => (
            <Tab
              key={category}
              className={({ selected }) =>
                classNames(
                  "w-full py-2.5 text-sm font-medium leading-5",
                  "ring-primary-500 ring-opacity-60 ring-offset-2 ring-offset-muted-100 focus:outline-none focus:ring-[1px] dark:ring-offset-muted-900",
                  shape === "rounded" ? "rounded-md" : "",
                  shape === "smooth" ? "rounded-lg" : "",
                  shape === "curved" ? "rounded-xl" : "",
                  shape === "full" ? "rounded-full" : "",
                  selected
                    ? "bg-white text-primary-500 shadow dark:bg-muted-800"
                    : "text-muted-400 hover:text-muted-500 dark:hover:text-muted-100"
                )
              }
            >
              {category}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-2">
          {Object.values(computedCategories).map((items, idx) => (
            <Tab.Panel
              key={idx}
              className={classNames(
                "py-3",
                "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2"
              )}
            >
              <ul>
                {items?.map((item: TrackTabsItem) => (
                  <li
                    key={item.id}
                    className="relative rounded-md p-3 hover:bg-muted-100 dark:hover:bg-muted-800 transition-colors duration-300"
                  >
                    <h5 className="text-sm font-medium text-muted-800 dark:text-muted-100 leading-5">
                      {item.title}
                    </h5>

                    <ul className="mt-1 flex space-x-1 text-xs font-normal leading-4 text-muted-500">
                      <li>{item.date}</li>
                      <li>{t("middot")}</li>
                      <li>
                        {item.commentCount} {t("comments")}
                      </li>
                      <li>{t("middot")}</li>
                      <li>
                        {item.shareCount} {t("shares")}
                      </li>
                    </ul>

                    <a
                      href={item.href}
                      className={classNames(
                        "absolute inset-0 rounded-md",
                        "ring-primary-400 focus:z-10 focus:outline-none focus:ring-2"
                      )}
                    />
                  </li>
                ))}
              </ul>
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};
export default TrackTabs;
