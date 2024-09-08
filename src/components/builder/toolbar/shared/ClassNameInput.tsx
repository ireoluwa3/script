import React from "react";
import Input from "@/components/elements/form/input/Input";

const ClassNameInput = ({ value, onChange, onKeyPress, placeholder }) => (
  <Input
    value={value}
    onChange={onChange}
    onKeyPress={onKeyPress}
    placeholder={placeholder}
    size="sm"
    shape={"rounded-sm"}
  />
);

export default ClassNameInput;
