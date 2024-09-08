import React, { useState, useEffect } from "react";
import ToolbarSection from "../ToolbarSection";
import ClassNameTag from "../shared/ClassNameTag";
import ClassNameInput from "../shared/ClassNameInput";
import ResponsiveIconButton from "../shared/ResponsiveIconButton";
import {
  addClassName,
  breakpoints,
  filterClasses,
  removeClassName,
  classSectionsConfig,
} from "@/utils/builder";
import { useNode } from "@craftjs/core";
import Select from "@/components/elements/form/select/Select";
import { capitalize } from "lodash";

const ClassSection = ({
  title,
  regex,
  showModes,
  activeBreakpoint,
  setActiveBreakpoint,
  classNames,
  summary,
}) => {
  const { actions, props } = useNode((node) => ({
    props: node.data.props,
  }));
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (classSectionsConfig[title].inputType === "select") {
      const currentClass = classNames.find((cls) =>
        cls.startsWith(activeBreakpoint ? `${activeBreakpoint}:` : "")
      );
      if (currentClass) {
        const selectedValue = currentClass.split(":").pop();
        setInputValue(selectedValue);
      } else {
        setInputValue("");
      }
    }
  }, [classNames, activeBreakpoint, title]);

  const sectionClasses = filterClasses(classNames, regex);
  const lightModeClasses = showModes
    ? sectionClasses.filter((name) => !name.startsWith("dark:"))
    : sectionClasses;
  const darkModeClasses = showModes
    ? sectionClasses.filter((name) => name.startsWith("dark:"))
    : [];

  const handleAddClassName = (newClass) => {
    const prefix = activeBreakpoint ? `${activeBreakpoint}:` : "";
    const classNameToAdd = `${prefix}${newClass}`;
    if (!/^(justify-|items-|self-)$/.test(classNameToAdd)) {
      addClassName(
        classNames,
        classNameToAdd,
        actions.setProp,
        setInputValue,
        setError
      );
    } else {
      setError("Invalid class name");
    }
  };

  const handleRemoveClassName = (name) => {
    removeClassName(classNames, name, actions.setProp);
  };

  const handleEditClassName = (name) => {
    handleRemoveClassName(name);
    const strippedName = activeBreakpoint
      ? name.replace(`${activeBreakpoint}:`, "")
      : name;
    setInputValue(strippedName);
  };

  const handleBreakpointChange = (bp) => {
    setActiveBreakpoint(bp === activeBreakpoint ? "" : bp);
  };

  return (
    <ToolbarSection
      title={title}
      summary={summary}
      props={[...classNames]}
      open
    >
      <div className="flex flex-col gap-2 w-full">
        <div className="flex gap-2 items-center justify-between">
          <h4 className="text-xs text-muted-600 dark:text-muted-400">
            {title}
          </h4>
          <div className="flex gap-1">
            {breakpoints.map((bp) => (
              <ResponsiveIconButton
                key={bp}
                breakpoint={bp}
                isActive={activeBreakpoint === bp}
                hasClasses={sectionClasses.some((name) =>
                  name.includes(`${bp}:`)
                )}
                onClick={() => handleBreakpointChange(bp)}
              />
            ))}
          </div>
        </div>
        <div className="mt-2">
          {classSectionsConfig[title].inputType === "select" ? (
            <Select
              value={inputValue || ""}
              onChange={(e) => handleAddClassName(e.target.value)}
              placeholder={`${title} (${
                activeBreakpoint ? activeBreakpoint.toUpperCase() : "Base"
              })`}
              options={[
                { value: "", label: "Select an option" },
                ...classSectionsConfig[title].options.map((option) => ({
                  value: option,
                  label: capitalize(option),
                })),
              ]}
            />
          ) : (
            <ClassNameInput
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" && handleAddClassName(e.currentTarget.value)
              }
              placeholder={`${title} (${
                activeBreakpoint ? activeBreakpoint.toUpperCase() : "Base"
              })`}
            />
          )}
        </div>
        <div className="flex flex-wrap gap-2 pt-2">
          {lightModeClasses
            .filter((name) =>
              activeBreakpoint
                ? name.includes(`${activeBreakpoint}:`)
                : !breakpoints.some((bp) => name.includes(`${bp}:`))
            )
            .filter((name) => !/^(justify-|items-|self-)$/.test(name))
            .map((name, index) => (
              <ClassNameTag
                key={index}
                name={name}
                onEdit={() => handleEditClassName(name)}
                onRemove={() => handleRemoveClassName(name)}
              />
            ))}
          {showModes && darkModeClasses.length > 0 && (
            <div className="w-full mt-2">
              <h4 className="text-xs text-muted-600 dark:text-muted-400">
                Dark Mode Classes
              </h4>
              <div>
                {darkModeClasses
                  .filter((name) =>
                    activeBreakpoint
                      ? name.includes(`${activeBreakpoint}:`)
                      : !breakpoints.some((bp) => name.includes(`${bp}:`))
                  )
                  .filter((name) => !/^(justify-|items-|self-)$/.test(name))
                  .map((name, index) => (
                    <ClassNameTag
                      key={index}
                      name={name}
                      onEdit={() => handleEditClassName(name)}
                      onRemove={() => handleRemoveClassName(name)}
                    />
                  ))}
              </div>
            </div>
          )}
        </div>
        {error && <div className="text-red-500 text-xs">{error}</div>}
      </div>
    </ToolbarSection>
  );
};

export default ClassSection;
