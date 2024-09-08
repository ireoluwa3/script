import React from "react";
import { Panel } from "../../panel/panel";
import { useDataTable } from "@/stores/datatable";
import StructureRenderer from "./StructureRenderer";

const ViewBase = ({ title }) => {
  const { panelAction, viewItem, isPanelOpen, closePanel, structureData } =
    useDataTable((state) => state);

  return (
    <Panel
      isOpen={isPanelOpen}
      onClose={closePanel}
      side={panelAction?.side}
      size={panelAction?.modelSize}
      title={panelAction?.label}
      tableName={title}
    >
      <div className="pb-20">
        <StructureRenderer
          formValues={structureData.get}
          modalItem={viewItem}
        />
      </div>
    </Panel>
  );
};

export const View = ViewBase;
