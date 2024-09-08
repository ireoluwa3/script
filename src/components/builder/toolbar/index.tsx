import { useEditor } from "@craftjs/core";
import React from "react";

export * from "./ToolbarItem";
export * from "./ToolbarSection";
export * from "./ToolbarTextInput";
export * from "./ToolbarDropdown";

export const Toolbar = () => {
  const { active, related } = useEditor((state, query) => {
    const currentlySelectedNodeId = query.getEvent("selected").first();
    return {
      active: currentlySelectedNodeId,
      related:
        currentlySelectedNodeId && state.nodes[currentlySelectedNodeId].related,
    };
  });

  return (
    <div className="py-1 h-full slimscroll overflow-y-auto">
      {active && related.toolbar && (
        <div className="relative">{React.createElement(related.toolbar)}</div>
      )}
      {!active && (
        <div
          className="px-5 py-2 flex flex-col items-center h-full justify-center text-center text-muted-400"
          style={{
            fontSize: "11px",
          }}
        >
          <h2 className="pb-1">Click on a component to start editing.</h2>
          <h2>
            You could also double-click on the layers below to edit their names,
            like in Photoshop
          </h2>
        </div>
      )}
    </div>
  );
};
