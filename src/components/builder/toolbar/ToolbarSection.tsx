import { useNode } from "@craftjs/core";
import React, { useState } from "react";
import { cn } from "@/utils/cn";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";

export const ToolbarSection = ({ title, props, summary, children }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const { nodeProps } = useNode((node) => ({
    nodeProps:
      props &&
      props.reduce((res: any, key: any) => {
        res[key] = node.data.props[key] || null;
        return res;
      }, {}),
  }));

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="text-muted-800 dark:text-muted-200">
      <div
        className={cn(
          "cursor-pointer flex justify-between items-center py-2 px-2",
          "border-b border-muted-300 dark:border-muted-700"
        )}
        onClick={handleToggle}
      >
        <div className="flex items-center space-x-4">
          <motion.div
            animate={{ rotate: isOpen ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <Icon
              icon={"mdi:chevron-right"}
              className="w-4 h-4 dark:text-muted-400"
            />
          </motion.div>
          <h5 className="text-sm font-medium text-muted-800 dark:text-muted-300">
            {title}
          </h5>
        </div>
        {summary && props ? (
          <h5 className="text-sm text-right text-blue-800 dark:text-muted-300">
            {summary(
              props.reduce((acc: any, key: any) => {
                acc[key] = nodeProps[key];
                return acc;
              }, {})
            )}
          </h5>
        ) : null}
      </div>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-2 bg-muted-100 dark:bg-muted-900 flex flex-wrap shadow-inner">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ToolbarSection;
