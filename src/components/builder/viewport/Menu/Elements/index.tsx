import React from "react";
import { useEditor } from "@craftjs/core";
import { Icon } from "@iconify/react";

export const Elements = ({}) => {
  const {
    connectors: { create },
  } = useEditor();

  const elements = [];

  return (
    <div className="grid grid-cols-3 gap-3 w-full p-3">
      {elements.map(({ component, icon, label }, index) => (
        <div
          key={index}
          className="w-full"
          ref={(ref) => ref && create(ref, component)}
        >
          <Item move>
            <Icon icon={icon} className="h-6 w-6" />
            <span>{label}</span>
          </Item>
        </div>
      ))}
    </div>
  );
};

const Item = ({ move, children }) => (
  <span
    style={{ cursor: move ? "move" : "pointer" }}
    className="w-full cursor-pointer flex flex-col items-center justify-start border px-1 py-3 rounded-md bg-muted-100 dark:bg-muted-900 text-muted-900 dark:text-muted-100 transition-all gap-2 text-sm hover:bg-muted-200 dark:hover:bg-muted-800 border-muted-300 dark:border-muted-700"
  >
    {children}
  </span>
);

export default Elements;
