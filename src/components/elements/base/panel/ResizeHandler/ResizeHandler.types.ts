export interface ResizeHandlerProps {
  size: string;
  sizeMap: Record<string, number>;
  side: "left" | "right" | "top" | "bottom";
  panelWidth: number;
  panelHeight: number;
  setPanelWidth: React.Dispatch<React.SetStateAction<number>>;
  setPanelHeight: React.Dispatch<React.SetStateAction<number>>;
  setHoverState: React.Dispatch<React.SetStateAction<boolean>>;
  updatePanelOpacity: React.Dispatch<React.SetStateAction<number>>;
  onClose: () => void;
}
