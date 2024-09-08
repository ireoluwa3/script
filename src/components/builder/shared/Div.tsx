import React, { forwardRef } from "react";
import { useNode } from "@craftjs/core";
import DivToolbar from "../toolbar/elements/div";

interface DivProps {
  children: React.ReactNode;
  className?: string;
}

interface DivInterface
  extends React.ForwardRefExoticComponent<
    DivProps & React.RefAttributes<HTMLElement>
  > {
  craft: object;
}

const Div = forwardRef<HTMLElement, DivProps>(
  ({ children, className }, ref) => {
    const { connectors } = useNode();

    return (
      <div
        ref={(ref) => connectors.connect(ref as HTMLElement)}
        className={className}
      >
        {children}
      </div>
    );
  }
);

Div.displayName = "Div";

(Div as DivInterface).craft = {
  displayName: "Div",
  props: {},
  rules: {
    canDrag: () => true,
  },
  related: {
    toolbar: DivToolbar,
  },
};

export default Div as DivInterface;
