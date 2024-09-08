import React from "react";
import { Icon } from "@iconify/react";
import Tag from "@/components/elements/base/tag/Tag";

const ClassNameTag = ({ name, onEdit, onRemove }) => (
  <Tag className="cursor-pointer relative" shape={"rounded-sm"}>
    <span onClick={onEdit}>{name}</span>
    <Icon
      icon="carbon:close-filled"
      className="text-red-500 hover:text-red-700 absolute -right-1 -top-1 cursor-pointer"
      onClick={(e) => {
        e.stopPropagation(); // Prevent triggering onEdit
        onRemove();
      }}
    />
  </Tag>
);

export default ClassNameTag;
