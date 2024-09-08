import React, { useState, useEffect, useCallback } from "react";
import $fetch from "@/utils/api";
import ToggleSwitch from "@/components/elements/form/toggle-switch/ToggleSwitch";
import { SwitchProps } from "./Switch.types";

const SwitchBase: React.FC<SwitchProps> = ({
  initialState,
  endpoint,
  active = true,
  disabled = false,
  onUpdate,
}) => {
  const [isEnabled, setIsEnabled] = useState(initialState);

  useEffect(() => {
    setIsEnabled(initialState);
  }, [initialState]);

  const handleChange = useCallback(async () => {
    const newValue = !isEnabled;
    const { error } = await $fetch({
      url: endpoint as string,
      method: "PUT",
      body: { status: newValue ? active : disabled },
    });

    if (!error) {
      setIsEnabled(newValue);
      if (onUpdate) onUpdate(newValue);
    }
  }, [isEnabled, active, disabled, endpoint, onUpdate]);

  return (
    <ToggleSwitch
      id={endpoint}
      color={isEnabled ? "success" : "danger"}
      checked={isEnabled}
      onChange={handleChange}
    />
  );
};

export const Switch = SwitchBase;
