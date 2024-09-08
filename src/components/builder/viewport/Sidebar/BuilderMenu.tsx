import React from "react";
import Blocks from "../Menu/Blocks";
import { motion } from "framer-motion";
import useBuilderStore from "@/stores/admin/builder";
import IconButton from "@/components/elements/base/button-icon/IconButton";
import { Icon } from "@iconify/react";
import { capitalize } from "lodash";
import { Toolbar } from "../../toolbar";

const BuilderMenu: React.FC = () => {
  const { sidebar, setSidebar } = useBuilderStore();

  return (
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: sidebar ? 240 : 0 }}
      transition={{ duration: 0.3 }}
      className="bg-muted-200 dark:bg-muted-850 overflow-hidden h-full"
    >
      <div className="flex items-center justify-between p-4 border-b border-muted-300 dark:border-muted-800 bg-muted-50 dark:bg-muted-950">
        <div className="text-muted-800 dark:text-muted-400">
          {capitalize(sidebar)}
        </div>

        <IconButton
          size="sm"
          shape="full"
          onClick={() => {
            setSidebar("");
          }}
        >
          <Icon icon="lucide:x" className="h-4 w-4" />
        </IconButton>
      </div>
      <div className="overflow-y-auto slimscroll h-[calc(100%_-_50px)]">
        {/* {sidebar === "ELEMENTS" && <Elements />} */}
        {sidebar === "BLOCKS" && <Blocks />}
        {sidebar === "TOOLBAR" && <Toolbar />}
      </div>
    </motion.div>
  );
};

export default BuilderMenu;
