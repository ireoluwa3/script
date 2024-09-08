export const breakpoints = ["xs", "sm", "md", "lg", "xl"];

export const classSectionsConfig = {
  Size: {
    regex:
      /^(w-|h-|max-w-|max-h-|((xs|sm|md|lg|xl|dark):)?(w-|h-|max-w-|max-h-))/,
    showModes: false,
    inputType: "input",
  },
  Margin: {
    regex:
      /^(m-|mx-|my-|mt-|mr-|mb-|ml-|((xs|sm|md|lg|xl|dark):)?(m-|mx-|my-|mt-|mr-|mb-|ml-))/,
    showModes: true,
    inputType: "input",
  },
  Padding: {
    regex:
      /^(p-|px-|py-|pt-|pr-|pb-|pl-|((xs|sm|md|lg|xl|dark):)?(p-|px-|py-|pt-|pr-|pb-|pl-))/,
    showModes: true,
    inputType: "input",
  },
  Display: {
    regex:
      /^(block|inline-block|inline|flex|inline-flex|grid|inline-grid|hidden|((xs|sm|md|lg|xl|dark):)?(block|inline-block|inline|flex|inline-flex|grid|inline-grid|hidden))/,
    showModes: false,
    inputType: "select",
    options: [
      "block",
      "inline-block",
      "inline",
      "flex",
      "inline-flex",
      "grid",
      "inline-grid",
      "hidden",
    ],
  },
  Flexbox: {
    regex: /^(flex-|((xs|sm|md|lg|xl|dark):)?(flex-))/,
    showModes: false,
    inputType: "input",
  },
  Grid: {
    regex: /^(grid-|((xs|sm|md|lg|xl|dark):)?(grid-))/,
    showModes: false,
    inputType: "input",
  },
  Alignment: {
    regex:
      /^(justify-|items-|self-|((xs|sm|md|lg|xl|dark):)?(justify-|items-|self-))/,
    showModes: false,
    inputType: "input",
  },
  Positioning: {
    regex:
      /^(absolute|relative|fixed|sticky|top-|right-|bottom-|left-|((xs|sm|md|lg|xl|dark):)?(absolute|relative|fixed|sticky|top-|right-|bottom-|left-))/,
    showModes: false,
    inputType: "input",
  },
  Typography: {
    regex: /^(text-|font-|((xs|sm|md|lg|xl|dark):)?(text-|font-))/,
    showModes: true,
    inputType: "input",
  },
  Background: {
    regex: /^(bg-|((xs|sm|md|lg|xl|dark):)?(bg-))/,
    showModes: true,
    inputType: "input",
  },
  Border: {
    regex: /^(border-|((xs|sm|md|lg|xl|dark):)?(border-))/,
    showModes: true,
    inputType: "input",
  },
  Shadow: {
    regex: /^(shadow-|((xs|sm|md|lg|xl|dark):)?(shadow-))/,
    showModes: true,
    inputType: "input",
  },
  Opacity: {
    regex: /^(opacity-|((xs|sm|md|lg|xl|dark):)?(opacity-))/,
    showModes: true,
    inputType: "input",
  },
  Cursor: {
    regex: /^(cursor-|((xs|sm|md|lg|xl|dark):)?(cursor-))/,
    showModes: false,
    inputType: "input",
  },
  Overflow: {
    regex: /^(overflow-|((xs|sm|md|lg|xl|dark):)?(overflow-))/,
    showModes: false,
    inputType: "input",
  },
};

export const filterClasses = (classNames, regex) => {
  return classNames.filter(
    (name) => regex.test(name) && !/^(justify-|items-|self-)$/.test(name)
  );
};

export const addClassName = (
  classNames,
  classNameToAdd,
  setProp,
  resetInput,
  setError
) => {
  if (
    classNameToAdd &&
    !classNames.includes(classNameToAdd) &&
    !/^(justify-|items-|self-)$/.test(classNameToAdd)
  ) {
    const updatedClassNames = removeConflictingClasses(
      classNames,
      classNameToAdd
    );
    if (isConflictingClassName(updatedClassNames, classNameToAdd)) {
      setError(
        "You cannot set conflicting display properties (Flexbox and Grid) on different breakpoints."
      );
      return;
    }
    const newClassNames = [...updatedClassNames, classNameToAdd].join(" ");
    setProp((props) => (props.className = newClassNames));
    resetInput("");
    setError(""); // Reset error message
  } else {
    setError("Invalid class name");
  }
};

const removeConflictingClasses = (classNames, classNameToAdd) => {
  const breakpointsRegex = new RegExp(`^(${breakpoints.join("|")}):`);
  const classNameParts = classNameToAdd.split(":");
  const baseClassName = classNameParts[classNameParts.length - 1];
  const breakpoint = classNameParts.length > 1 ? classNameParts[0] : null;

  return classNames.filter((className) => {
    const parts = className.split(":");
    const existingBaseClassName = parts[parts.length - 1];
    const existingBreakpoint = parts.length > 1 ? parts[0] : null;

    if (breakpointsRegex.test(classNameToAdd) && breakpoint) {
      return (
        existingBaseClassName !== baseClassName ||
        existingBreakpoint !== breakpoint
      );
    }
    return existingBaseClassName !== baseClassName;
  });
};

export const removeClassName = (classNames, name, setProp) => {
  const updatedClassNames = classNames
    .filter((className) => className !== name)
    .join(" ");
  setProp((props) => (props.className = updatedClassNames));
};

const isConflictingClassName = (classNames, classNameToAdd) => {
  const displayClasses = classNames.filter((cls) =>
    /^(flex|grid|((xs|sm|md|lg|xl):)?(flex|grid))/.test(cls)
  );
  const newClassIsGrid = /^(grid|((xs|sm|md|lg|xl):)?grid)/.test(
    classNameToAdd
  );
  const newClassIsFlex = /^(flex|((xs|sm|md|lg|xl):)?flex)/.test(
    classNameToAdd
  );

  if (newClassIsGrid && displayClasses.some((cls) => /flex/.test(cls))) {
    return true;
  }

  if (newClassIsFlex && displayClasses.some((cls) => /grid/.test(cls))) {
    return true;
  }

  return false;
};

export const shouldShowSection = (section, classNames) => {
  if (section === "Grid") {
    return classNames.some((cls) =>
      /^(grid|((xs|sm|md|lg|xl):)?grid)/.test(cls)
    );
  }
  if (section === "Flexbox") {
    return classNames.some((cls) =>
      /^(flex|((xs|sm|md|lg|xl):)?flex)/.test(cls)
    );
  }
  return true;
};
