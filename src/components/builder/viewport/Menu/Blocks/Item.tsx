// src/components/Item.tsx
import React from "react";
import Child from "../../../shared/Child";
import { cleanHTMLElement } from "../../../utils/html";
import { parse } from "node-html-parser";

type ItemProps = {
  connectors: any;
  c: any;
  move: boolean;
  children: React.ReactNode;
};
const Item: React.FC<ItemProps> = ({ connectors, c, move, children }) => {
  const root = cleanHTMLElement(parse(c.source) as unknown as RootProps);
  return (
    <div
      ref={(ref) =>
        connectors.create(ref as HTMLElement, <Child root={root} />)
      }
    >
      <a
        style={{ cursor: move ? "move" : "pointer" }}
        className="relative w-full cursor-pointer text-muted-800 dark:text-muted-200 hover:text-muted-800 transition-all gap-2 text-sm"
      >
        {children}
      </a>
    </div>
  );
};

export default Item;
