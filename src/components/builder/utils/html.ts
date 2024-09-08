const cleanHTMLClasses = (classNames: any) => {
  if (typeof classNames === "string" || classNames instanceof String)
    return classNames;
  else if (Array.isArray(classNames) || classNames instanceof Array)
    return classNames.join(" ");
  else return "";
};

export const cleanHTMLAttrs = (attrs: any) => {
  if (!attrs) return {};
  const mapped = Object.keys(attrs).reduce((acc: any, key: string) => {
    switch (key) {
      case "class":
        break; // skip class attribute
      case "checked":
        acc["checkeddefault"] = attrs[key];
        break;
      case "for":
        acc["htmlFor"] = attrs[key];
        break;
      case "autocomplete":
        acc["autoComplete"] = attrs[key];
        break;
      case "tabindex":
        acc["tabIndex"] = attrs[key];
        break;
      default:
        acc[key] = attrs[key];
    }
    return acc;
  }, {});
  return mapped;
};

const deepCloneNode = (node: RootProps): RootProps => {
  return {
    ...node,
    attrs: { ...node.attrs },
    childNodes: node.childNodes.map(deepCloneNode),
  };
};

const updateNodeWithLabel = (
  root: RootProps,
  labelFor: string,
  labelText: string
) => {
  if (root.attrs && root.attrs["id"] === labelFor && !root.attrs["label"]) {
    root.attrs = { ...root.attrs, label: labelText };
  }

  root.childNodes.forEach((child) =>
    updateNodeWithLabel(child, labelFor, labelText)
  );
};

export const transferLabelInnerText = (root: RootProps) => {
  if (root.tagName === "LABEL" && root.attrs && root.attrs["htmlFor"]) {
    const labelFor = root.attrs["htmlFor"];
    updateNodeWithLabel(root, labelFor, root.innerText);
  }

  root.childNodes.forEach((child) => transferLabelInnerText(child));
};

// Wrapper function to call transferLabelInnerText for each node
const traverseAndTransfer = (root: RootProps) => {
  transferLabelInnerText(root);
};

export const cleanHTMLElement = (root: RootProps): RootProps => {
  traverseAndTransfer(root);
  const classNames = cleanHTMLClasses(root?.classNames);
  return {
    childNodes: root.childNodes.map(cleanHTMLElement),
    attrs: cleanHTMLAttrs(root.attrs) as object,
    tagName: root.tagName,
    classNames: classNames as string,
    nodeType: root.nodeType,
    innerText: root.innerText,
    constructor: root.constructor.name,
  };
};

export const getElementProperty = (
  element: HTMLElement,
  property: string,
  defaultValue: string
): string => {
  const value = window.getComputedStyle(element)[property as any];
  if (value !== defaultValue) return value;
  else if (!element || element.childNodes.length === 0) return defaultValue;
  else
    return getElementProperty(
      element?.childNodes[0] as HTMLElement,
      property,
      defaultValue
    );
};

export const waitForElement = (
  target: HTMLElement,
  selector: string
): Promise<HTMLElement> => {
  return new Promise((r) => {
    const e = target.querySelector(selector) as HTMLElement;
    if (e) return r(e);

    const observer = new MutationObserver(async (m) => {
      const e = target.querySelector(selector) as HTMLElement;
      await new Promise((r) => setTimeout(r, 100)); // hack to wait for computed styles
      if (e) {
        r(e);
        observer.disconnect();
      }
    });

    observer.observe(target, { childList: true, subtree: true });
  });
};

export const isDarkBackground = (bgColor: string) => {
  const [r, g, b] = bgColor
    .match(/\(([^()]+)\)/)![1]
    .split(",")
    .map((v) => parseInt(v));
  const hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));
  return hsp < 127.5;
};
