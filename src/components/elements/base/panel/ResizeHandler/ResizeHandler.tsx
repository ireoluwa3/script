import { animate, motion, useDragControls } from "framer-motion";
import { useCallback } from "react";
import { ResizeHandlerProps } from "./ResizeHandler.types";

const SNAP_THRESHOLD_PERCENTAGE = 10;

const ResizeHandlerBase = ({
  size,
  sizeMap,
  side,
  panelWidth,
  panelHeight,
  setPanelWidth,
  setPanelHeight,
  setHoverState,
  updatePanelOpacity,
  onClose,
}: ResizeHandlerProps) => {
  const controls = useDragControls();

  const calculateAdjustment = useCallback(
    (delta, isWidth = true) => {
      switch (side) {
        case "right":
          return isWidth ? -delta.x : 0;
        case "left":
          return isWidth ? delta.x : 0;
        case "bottom":
          return !isWidth ? -delta.y : 0;
        case "top":
          return !isWidth ? delta.y : 0;
        default:
          return 0;
      }
    },
    [side]
  );

  const handleDrag = useCallback(
    (event, info) => {
      const adjustment = calculateAdjustment(info.delta, true);
      const heightAdjustment = calculateAdjustment(info.delta, false);

      let percentage = 100; // Start with full visibility
      if (side === "left" || side === "right") {
        const newWidth = Math.min(panelWidth + adjustment, window.innerWidth);
        setPanelWidth(newWidth);

        // Calculate percentage for opacity and blur when below min size
        if (newWidth < sizeMap.sm) {
          percentage = (newWidth / sizeMap.sm) * 100;
        }
      } else if (side === "top" || side === "bottom") {
        const newHeight = Math.min(
          panelHeight + heightAdjustment,
          window.innerHeight
        );
        setPanelHeight(newHeight);

        // Calculate percentage for opacity and blur when below min size
        if (newHeight < sizeMap.sm) {
          percentage = (newHeight / sizeMap.sm) * 100;
        }
      }

      updatePanelOpacity(percentage);
    },
    [
      calculateAdjustment,
      side,
      updatePanelOpacity,
      panelWidth,
      setPanelWidth,
      sizeMap.sm,
      panelHeight,
      setPanelHeight,
    ]
  );

  const handleDragEnd = useCallback(() => {
    const newWidth = panelWidth;
    const newHeight = panelHeight;

    // Snapping logic for width
    if (side === "left" || side === "right") {
      const targetWidth =
        Math.abs(window.innerWidth - panelWidth) <=
        window.innerWidth * (SNAP_THRESHOLD_PERCENTAGE / 100)
          ? window.innerWidth
          : newWidth < sizeMap.sm
          ? sizeMap[size]
          : newWidth;

      animate(panelWidth, targetWidth, {
        duration: 0.2, // Duration of the animation
        onUpdate: setPanelWidth, // This function updates the state with the new value
      });
    }

    // Snapping logic for height
    if (side === "top" || side === "bottom") {
      const targetHeight =
        Math.abs(window.innerHeight - panelHeight) <=
        window.innerHeight * (SNAP_THRESHOLD_PERCENTAGE / 100)
          ? window.innerHeight
          : newHeight < sizeMap.sm
          ? sizeMap[size]
          : newHeight;

      animate(panelHeight, targetHeight, {
        duration: 0.2, // Duration of the animation
        onUpdate: setPanelHeight, // This function updates the state with the new value
      });
    }

    // Conditionally trigger closing of the panel
    const isWidthBelowMinimum =
      (side === "left" || side === "right") && newWidth < sizeMap.sm;
    const isHeightBelowMinimum =
      (side === "top" || side === "bottom") && newHeight < sizeMap.sm;
    if (isWidthBelowMinimum || isHeightBelowMinimum) {
      onClose();
      setPanelWidth(sizeMap[size]);
      setPanelHeight(sizeMap[size]);
    }

    // Reset opacity and blur to 100% as the dragging has ended
    updatePanelOpacity(100);
  }, [
    panelWidth,
    panelHeight,
    side,
    sizeMap,
    updatePanelOpacity,
    size,
    setPanelWidth,
    setPanelHeight,
    onClose,
  ]);

  const isWidthResizer = side === "left" || side === "right";
  const isHeightResizer = side === "top" || side === "bottom";

  return (
    <>
      {isWidthResizer && (
        <motion.div
          className={`absolute top-0 bottom-0 w-8 cursor-ew-resize ${
            side === "right" ? "left-0" : "right-0"
          }`}
          style={{ zIndex: 9999, touchAction: "none" }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          dragControls={controls}
          onMouseEnter={() => setHoverState(true)}
          onMouseLeave={() => setHoverState(false)}
        />
      )}
      {isHeightResizer && (
        <motion.div
          className={`absolute left-0 right-0 h-8 cursor-ns-resize ${
            side === "bottom" ? "top-0" : "bottom-0"
          }`}
          style={{ zIndex: 9999, touchAction: "none" }}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          dragControls={controls}
          onMouseEnter={() => setHoverState(true)}
          onMouseLeave={() => setHoverState(false)}
        />
      )}
    </>
  );
};

export const ResizeHandler = ResizeHandlerBase;
