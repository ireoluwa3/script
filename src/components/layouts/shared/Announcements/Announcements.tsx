import React, { memo, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useDashboardStore } from "@/stores/dashboard";
import { Icon } from "@iconify/react";
import { Announcement, AnnouncementsProps } from "./Announcements.types";
import { useTranslation } from "next-i18next";

const AnnouncementItem: React.FC<{
  item: Announcement;
  index: number;
}> = ({ item, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.01 },
    }),
  };
  return (
    <motion.li
      ref={ref}
      className="relative rounded-md p-3 hover:bg-muted-100 dark:hover:bg-muted-900 transition-colors duration-300 cursor-pointer bg-muted-50 dark:bg-muted-850"
      custom={index}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      exit={{ opacity: 0, y: 20 }}
      variants={itemVariants}
    >
      <div className="flex justify-between items-start">
        <div className="flex gap-3.5">
          <div className="relative flex h-12 w-12 items-center bg-white dark:bg-muted-900 justify-center rounded-full border border-muted-200 shadow-lg shadow-muted-300/30 dark:border-muted-800 dark:shadow-muted-800/30">
            <Icon
              icon="ph:notification-duotone"
              className="h-4 w-4 stroke-primary-500 stroke-[1.28px] text-primary-500 transition-[stroke] duration-300"
            />
          </div>
          <div>
            <p className="text-sm leading-snug text-muted-500">
              {item.link ? (
                <a
                  href={item.link}
                  className="cursor-pointer font-medium text-primary-500 hover:underline"
                >
                  {item.title}
                </a>
              ) : (
                <span className="font-medium text-primary-500">
                  {item.title}
                </span>
              )}{" "}
              {item.message}
            </p>
            <small className="text-xs text-muted-400">
              {new Date(item.createdAt).toLocaleTimeString()}
            </small>
          </div>
        </div>
      </div>
    </motion.li>
  );
};

const AnnouncementsBase: React.FC<AnnouncementsProps> = ({}) => {
  const { t } = useTranslation();
  const { announcements } = useDashboardStore();
  return (
    <div className="relative w-full flex flex-col overflow-x-hidden slimscroll">
      <div className="flex-grow mt-2">
        {announcements.length === 0 ? (
          <div className="text-center text-muted-500 text-md">
            {t("No announcements available.")}
          </div>
        ) : (
          <ul className="relative space-y-2 overflow-y-auto max-h-[calc(100vh_-_80px)] slimscroll pe-1">
            {announcements.map((item: Announcement, index) => (
              <AnnouncementItem key={item.id} item={item} index={index} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
export const Announcements = memo(AnnouncementsBase);
