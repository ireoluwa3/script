export const isPercentage = (val: string) =>
  typeof val === "string" && val.indexOf("%") > -1;

export const percentToPx = (value: any, comparativeValue: number) => {
  if (typeof value !== "string") return value;
  if (value.indexOf("px") > -1 || value === "auto" || !comparativeValue) {
    return value;
  }
  const percent = parseInt(value);
  return (percent / 100) * comparativeValue + "px";
};

export const pxToPercent = (value: any, comparativeValue: number) => {
  if (typeof value !== "number" || !comparativeValue) return value;
  const val = (Math.abs(value) / comparativeValue) * 100;
  return value < 0 ? -1 * val : Math.round(val);
};

export const getElementDimensions = (element: HTMLElement) => {
  const computedStyle = getComputedStyle(element);

  let height = element.clientHeight,
    width = element.clientWidth; // width with padding

  height -=
    parseFloat(computedStyle.paddingTop) +
    parseFloat(computedStyle.paddingBottom);
  width -=
    parseFloat(computedStyle.paddingLeft) +
    parseFloat(computedStyle.paddingRight);

  return {
    width,
    height,
  };
};
