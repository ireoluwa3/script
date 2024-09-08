import React from "react";
import { useNode, useEditor } from "@craftjs/core";
import Child from "./Child";
import NextLink from "next/link";

const handleClick = (props: any) => {
  const link = props?.link || "#";
  if (props?.newTab) {
    window.open(link, "_blank")?.focus();
  } else {
    location.href = link;
  }
};

interface LinkProps {
  r: any;
  d: number[];
  i: number;
  propId: string;
}
interface LinkInterface extends React.FC<LinkProps> {
  craft: object;
}

const Link: LinkInterface = ({ r, d, i, propId }) => {
  const { node } = useNode((node) => ({ node }));
  const { enabled } = useEditor((state) => ({
    enabled: state.options.enabled,
  }));

  const { connectors } = useNode((node) => ({ node }));

  const { ["class"]: foo, ...attrsR } = r.attrs;

  const onClick = (e: any) => {
    e.preventDefault();
    if (!enabled) handleClick(node.data.props[propId]);
  };

  const link = node.data.props[propId]?.link || "#";
  const linkContent = <Child root={r} d={d.concat(i)} />;

  return enabled ? (
    <a
      ref={(ref) => connectors.connect(ref as HTMLElement)}
      {...attrsR}
      href={link}
      className={r.classNames}
      onClick={onClick}
    >
      {linkContent}
    </a>
  ) : (
    <NextLink
      href={link}
      className={r.classNames}
      passHref
      target={node.data.props[propId]?.newTab ? "_blank" : ""}
    >
      {linkContent}
    </NextLink>
  );
};

export { Link };

Link.craft = {
  displayName: "Link",
  props: {},
  rules: {
    canDrag: () => true,
  },
  related: {},
};
