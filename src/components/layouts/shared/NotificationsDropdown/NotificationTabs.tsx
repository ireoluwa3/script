import React, { useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useDashboardStore } from "@/stores/dashboard";
import { cn } from "@/utils/cn";
import Button from "@/components/elements/base/button/Button";
import { useTranslation } from "next-i18next";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";

interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  link: string;
  createdAt: string;
  updatedAt: string;
}
interface NotificationTabsProps {
  shape?: "straight" | "rounded" | "smooth" | "curved" | "full";
}
const NotificationItem: React.FC<{
  item: Notification;
  index: number;
  onDragEnd: (event, info, id) => void;
}> = ({ item, index, onDragEnd }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.01 },
    }),
    exit: { opacity: 0, x: -100, transition: { duration: 0.5 } },
  };

  return (
    <motion.li
      ref={ref}
      className="relative rounded-md p-3 hover:bg-muted-100 dark:hover:bg-muted-900 transition-colors duration-300 cursor-pointer bg-muted-50 dark:bg-muted-850"
      custom={index}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      exit="exit"
      variants={itemVariants}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.4}
      onDragEnd={(event, info) => onDragEnd(event, info, item.id)}
      style={{
        zIndex: 100 - index,
        position: "relative",
      }}
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

const NotificationTabs: React.FC<NotificationTabsProps> = ({
  shape = "smooth",
}) => {
  const { t } = useTranslation();
  const { notifications, removeNotification, clearNotifications } =
    useDashboardStore();
  const [clearIcon, setClearIcon] = useState<{
    [key: string]: boolean;
  }>({});
  const categories = {
    activity: notifications.filter(
      (notification) => notification.type.toLowerCase() === "activity"
    ),
    system: notifications.filter(
      (notification) => notification.type.toLowerCase() === "system"
    ),
    security: notifications.filter(
      (notification) => notification.type.toLowerCase() === "security"
    ),
  };

  const handleDragEnd = (event, info, id) => {
    if (info.point.x <= 25) {
      removeNotification(id);
    }
  };
  const handleClearClick = (category) => {
    if (clearIcon[category]) {
      clearNotifications(category);
    } else {
      setClearIcon((prev) => ({ ...prev, [category]: true }));
    }
  };
  return (
    <div className="relative w-full h-full flex flex-col overflow-x-hidden slimscroll">
      <div className="flex-shrink-0 pe-1">
        <TabGroup>
          <TabList
            className={`
              flex space-x-1 bg-muted-100 p-1 dark:bg-muted-900
              ${shape === "rounded" ? "rounded-md" : ""}
              ${shape === "smooth" ? "rounded-lg" : ""}
              ${shape === "curved" ? "rounded-xl" : ""}
              ${shape === "full" ? "rounded-full" : ""}
            `}
          >
            {Object.keys(categories).map((category) => (
              <Tab
                key={category}
                className={({ selected }) =>
                  cn(
                    "w-full py-2.5 text-sm font-medium leading-5",
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
                {category.charAt(0).toUpperCase() + category.slice(1)} (
                {categories[category].length})
              </Tab>
            ))}
          </TabList>
          <TabPanels className="flex-grow mt-2">
            {Object.entries(categories).map(([category, items]) => (
              <TabPanel key={category} className="relative py-3">
                {items.length === 0 ? (
                  <div className="text-center text-muted-500 text-md">
                    {t("All caught up")}
                  </div>
                ) : (
                  <>
                    <AnimatePresence initial={false}>
                      <ul className="relative space-y-2">
                        {items.map((item: Notification, index) => (
                          <NotificationItem
                            key={item.id} // Ensure this key is unique for each item
                            item={item}
                            index={index}
                            onDragEnd={handleDragEnd}
                          />
                        ))}
                      </ul>
                    </AnimatePresence>
                    <div className="flex justify-end mt-2">
                      <Button
                        variant={"pastel"}
                        size={"sm"}
                        color={"danger"}
                        shape={"rounded"}
                        onClick={() => handleClearClick(category)}
                      >
                        {clearIcon[category] ? (
                          `Clear ${category} notifications`
                        ) : (
                          <Icon
                            icon="ph:x-bold"
                            className="h-4 w-4 text-danger-500"
                          />
                        )}
                      </Button>
                    </div>
                  </>
                )}
              </TabPanel>
            ))}
          </TabPanels>
        </TabGroup>
      </div>
    </div>
  );
};
export default NotificationTabs;
