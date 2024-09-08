import React, { useEffect, useState } from "react";
import classNames from "clsx";
import { Icon } from "@iconify/react";

const Typewriter = (props) => {
  const {
    children,
    className,
    lineClassName,
    as = "div",
    lines = [],
    interval = 3000,
    withIcon = true,
    ...rest
  } = props;

  const [index, setIndex] = useState<number | null>(null);

  useEffect(() => {
    if (lines.length < 1 && !children) return;

    const linesLength = children ? 1 : lines.length;

    if (linesLength === 1) {
      setTimeout(() => setIndex(0), 1500);
    }

    if (linesLength > 1) {
      const intervalID = setInterval(
        () => setIndex((i: number) => (i + 1) % linesLength),
        interval
      );
      return () => clearInterval(intervalID);
    }
  }, [lines, children, interval]);

  const Component = as;

  return (
    <Component
      className={classNames(
        "m-0 inline-flex items-baseline font-mono",
        className
      )}
    >
      {withIcon && (
        <Icon
          icon="carbon:chevron-right"
          className="hidden shrink-0 grow-0 self-center text-omega-500 md:block"
        />
      )}
      <span
        key={index}
        className={classNames(
          "animate-typewriter overflow-hidden whitespace-nowrap",
          lineClassName
        )}
        {...rest}
      >
        {index !== null && (lines[index] || children)}
      </span>
      <div className="ml-2 -translate-y-2 animate-blink">_</div>
    </Component>
  );
};

export default Typewriter;
