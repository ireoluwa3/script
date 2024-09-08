import { useNode, useEditor } from "@craftjs/core";
import { cn } from "@/utils/cn";
import { Resizable } from "re-resizable";
import React, { useRef, useEffect, useState, useCallback } from "react";
import { debounce } from "lodash";

import {
  isPercentage,
  pxToPercent,
  percentToPx,
  getElementDimensions,
} from "@/utils/numToMeasurement";

const Indicators: React.FC<{ bound?: "row" | "column" }> = ({ bound }) => {
  const indicatorStyles: React.CSSProperties = {
    position: "absolute",
    width: "10px",
    height: "10px",
    background: "#fff",
    borderRadius: "100%",
    display: "block",
    boxShadow: "0px 0px 12px -1px rgba(0, 0, 0, 0.25)",
    zIndex: 99999,
    pointerEvents: "none",
    border: "2px solid #36a9e0",
  };

  const getPositionStyle = (index: number) => {
    switch (index) {
      case 1:
        return bound
          ? bound === "row"
            ? { left: "50%", top: "-5px", transform: "translateX(-50%)" }
            : { top: "50%", left: "-5px", transform: "translateY(-50%)" }
          : { left: "-5px", top: "-5px" };
      case 2:
        return {
          right: "-5px",
          top: "-5px",
          display: bound ? "none" : "block",
        };
      case 3:
        return bound
          ? bound === "row"
            ? { left: "50%", bottom: "-5px", transform: "translateX(-50%)" }
            : { bottom: "50%", left: "-5px", transform: "translateY(-50%)" }
          : { left: "-5px", bottom: "-5px" };
      case 4:
        return {
          bottom: "-5px",
          right: "-5px",
          display: bound ? "none" : "block",
        };
      default:
        return {};
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    >
      {Array.from({ length: 4 }).map((_, index) => (
        <span
          key={index}
          style={{ ...indicatorStyles, ...getPositionStyle(index + 1) }}
        ></span>
      ))}
    </div>
  );
};

export const Resizer = React.forwardRef<any, any>(
  ({ propKey, children, ...props }, ref) => {
    const {
      id,
      actions: { setProp },
      connectors: { connect },
      fillSpace,
      nodeWidth,
      nodeHeight,
      parent,
      active,
      inNodeContext,
    } = useNode((node) => ({
      parent: node.data.parent,
      active: node.events.selected,
      nodeWidth: node.data.props[propKey.width],
      nodeHeight: node.data.props[propKey.height],
      fillSpace: node.data.props.fillSpace,
    }));

    const { isRootNode, parentDirection } = useEditor((state, query) => {
      return {
        parentDirection:
          parent &&
          state.nodes[parent] &&
          state.nodes[parent].data.props.flexDirection,
        isRootNode: query.node(id).isRoot(),
      };
    });

    const resizable = useRef<any>(null);
    const isResizing = useRef<boolean>(false);
    const editingDimensions = useRef<any>(null);
    const nodeDimensions = useRef<any>(null);
    nodeDimensions.current = { width: nodeWidth, height: nodeHeight };

    /**
     * Using an internal value to ensure the width/height set in the node is converted to px
     * because for some reason the <re-resizable /> library does not work well with percentages.
     */
    const [internalDimensions, setInternalDimensions] = useState({
      width: nodeWidth,
      height: nodeHeight,
    });

    const updateInternalDimensionsInPx = useCallback(() => {
      const { width: nodeWidth, height: nodeHeight } = nodeDimensions.current;

      const width = percentToPx(
        nodeWidth,
        resizable.current &&
          getElementDimensions(resizable.current.resizable.parentElement).width
      );
      const height = percentToPx(
        nodeHeight,
        resizable.current &&
          getElementDimensions(resizable.current.resizable.parentElement).height
      );

      setInternalDimensions({
        width,
        height,
      });
    }, []);

    const updateInternalDimensionsWithOriginal = useCallback(() => {
      const { width: nodeWidth, height: nodeHeight } = nodeDimensions.current;
      setInternalDimensions({
        width: nodeWidth,
        height: nodeHeight,
      });
    }, []);

    const getUpdatedDimensions = (width, height) => {
      const dom = resizable.current.resizable;
      if (!dom) return;

      const currentWidth = parseInt(editingDimensions.current.width),
        currentHeight = parseInt(editingDimensions.current.height);

      return {
        width: currentWidth + parseInt(width),
        height: currentHeight + parseInt(height),
      };
    };

    useEffect(() => {
      if (!isResizing.current) updateInternalDimensionsWithOriginal();
    }, [nodeWidth, nodeHeight, updateInternalDimensionsWithOriginal]);

    useEffect(() => {
      const listener = debounce(updateInternalDimensionsWithOriginal, 1);
      window.addEventListener("resize", listener);

      return () => {
        window.removeEventListener("resize", listener);
      };
    }, [updateInternalDimensionsWithOriginal]);

    return (
      <Resizable
        enable={[
          "top",
          "left",
          "bottom",
          "right",
          "topLeft",
          "topRight",
          "bottomLeft",
          "bottomRight",
        ].reduce((acc: any, key) => {
          acc[key] = active && inNodeContext;
          return acc;
        }, {})}
        className={cn([
          {
            "m-auto": isRootNode,
            flex: true,
          },
        ])}
        ref={(ref) => {
          if (ref) {
            resizable.current = ref;
            connect(resizable.current.resizable);
          }
        }}
        size={internalDimensions}
        onResizeStart={(e) => {
          updateInternalDimensionsInPx();
          e.preventDefault();
          e.stopPropagation();
          const dom = resizable.current.resizable;
          if (!dom) return;
          editingDimensions.current = {
            width: dom.getBoundingClientRect().width,
            height: dom.getBoundingClientRect().height,
          };
          isResizing.current = true;
        }}
        onResize={(_, __, ___, d) => {
          const dom = resizable.current.resizable;
          let { width, height }: any = getUpdatedDimensions(d.width, d.height);
          if (isPercentage(nodeWidth))
            width =
              pxToPercent(
                width,
                getElementDimensions(dom.parentElement).width
              ) + "%";
          else width = `${width}px`;

          if (isPercentage(nodeHeight))
            height =
              pxToPercent(
                height,
                getElementDimensions(dom.parentElement).height
              ) + "%";
          else height = `${height}px`;

          if (isPercentage(width) && dom.parentElement.style.width === "auto") {
            width = editingDimensions.current.width + d.width + "px";
          }

          if (
            isPercentage(height) &&
            dom.parentElement.style.height === "auto"
          ) {
            height = editingDimensions.current.height + d.height + "px";
          }

          setProp((prop: any) => {
            prop[propKey.width] = width;
            prop[propKey.height] = height;
          }, 500);
        }}
        onResizeStop={() => {
          isResizing.current = false;
          updateInternalDimensionsWithOriginal();
        }}
        {...props}
      >
        {children}
        {active && (
          <Indicators
            bound={fillSpace === "yes" ? parentDirection : false}
          ></Indicators>
        )}
      </Resizable>
    );
  }
);
Resizer.displayName = "Resizer";

export default Resizer;
