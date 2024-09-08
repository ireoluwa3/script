import React, { useState } from "react";
import { useNode } from "@craftjs/core";
import ToolbarSection from "../ToolbarSection";
import ClassSection from "../shared/ClassSection";
import {
  addClassName,
  classSectionsConfig,
  filterClasses,
  removeClassName,
  shouldShowSection,
} from "@/utils/builder";
import ClassNameTag from "../shared/ClassNameTag";
import ClassNameInput from "../shared/ClassNameInput";

const DivToolbar = () => {
  const { actions, props } = useNode((node) => ({
    props: node.data.props,
  }));
  const [customClassInput, setCustomClassInput] = useState("");
  const [activeBreakpoints, setActiveBreakpoints] = useState({});
  const [error, setError] = useState("");

  const classNames = props.className?.split(" ").filter(Boolean) || [];

  // Filter custom classes (non-sectioned)
  const sectionedClasses = Object.values(classSectionsConfig).flatMap(
    ({ regex }) => filterClasses(classNames, regex)
  );
  const customClasses = classNames.filter(
    (name) => !sectionedClasses.includes(name)
  );

  const handleBreakpointChange = (section, bp) => {
    setActiveBreakpoints((prev) => ({
      ...prev,
      [section]: prev[section] === bp ? "" : bp,
    }));
  };

  const handleEditClassName = (name, setInputValue) => {
    removeClassName(classNames, name, actions.setProp);
    setInputValue(name);
  };

  const getClassSectionSummary = (section) => {
    const sectionClasses = filterClasses(
      classNames,
      classSectionsConfig[section].regex
    );
    return sectionClasses.length;
  };

  return (
    <>
      <ToolbarSection
        title="Custom Classes"
        open
        props={["className"]}
        summary={(props) => {
          const count = customClasses.length;
          return (
            <>
              <span
                className={`text-sm text-right ${
                  count > 0
                    ? "text-muted-800 dark:text-muted-100"
                    : "text-muted-400 dark:text-muted-600"
                }`}
              >
                {count}
              </span>
            </>
          );
        }}
      >
        <div>
          <h3 className="font-semibold text-md">Custom Classes</h3>
          <div className="flex flex-wrap gap-2 py-2">
            {customClasses.map((name, index) => (
              <ClassNameTag
                key={index}
                name={name}
                onEdit={() => handleEditClassName(name, setCustomClassInput)}
                onRemove={() =>
                  removeClassName(classNames, name, actions.setProp)
                }
              />
            ))}
          </div>
          <div className="mt-2">
            <ClassNameInput
              value={customClassInput}
              onChange={(e) => setCustomClassInput(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" &&
                addClassName(
                  classNames,
                  customClassInput,
                  actions.setProp,
                  setCustomClassInput,
                  setError // Added setError parameter
                )
              }
              placeholder="Add class"
            />
          </div>
          {error && <div className="text-red-500 text-xs">{error}</div>}
        </div>
      </ToolbarSection>
      {Object.keys(classSectionsConfig).map(
        (section) =>
          shouldShowSection(section, classNames) && (
            <ClassSection
              key={section}
              title={section}
              regex={classSectionsConfig[section].regex}
              showModes={classSectionsConfig[section].showModes}
              activeBreakpoint={activeBreakpoints[section.toLowerCase()]}
              setActiveBreakpoint={(bp) =>
                handleBreakpointChange(section.toLowerCase(), bp)
              }
              classNames={classNames}
              summary={(props) => {
                const count = getClassSectionSummary(section);
                return (
                  <>
                    <span
                      className={`text-sm text-right ${
                        count > 0
                          ? "text-muted-800 dark:text-muted-100"
                          : "text-muted-400 dark:text-muted-600"
                      }`}
                    >
                      {count}
                    </span>
                  </>
                );
              }}
            />
          )
      )}
    </>
  );
};

export default DivToolbar;
