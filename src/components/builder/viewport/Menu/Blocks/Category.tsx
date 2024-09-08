// src/components/Sidebar/Category.tsx
import React from "react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

interface CategoryProps {
  title: string;
  height?: string;
  children: React.ReactNode;
  visible: boolean;
  setVisible: () => void;
}

const Category: React.FC<CategoryProps> = ({
  title,
  height,
  children,
  visible,
  setVisible,
}) => {
  return (
    <div className="flex flex-col text-muted-800 dark:text-muted-200">
      <div
        className="flex items-center cursor-pointer p-2 px-4 border-b border-muted-300 dark:border-muted-600"
        onClick={setVisible}
      >
        <h2 className="text-xs uppercase">{title}</h2>
        <Icon
          icon="akar-icons:chevron-down"
          className={`w-4 h-4 ml-auto transition-transform ${
            visible ? "rotate-180" : "rotate-0"
          }`}
        />
      </div>
      {visible && (
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: height || "auto" }}
          className="overflow-auto"
        >
          {children}
        </motion.div>
      )}
    </div>
  );
};

export default Category;
