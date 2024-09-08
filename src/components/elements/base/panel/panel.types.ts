export interface PanelProps {
  isOpen: boolean;
  children: React.ReactNode;
  title: string;
  side?: "left" | "right" | "top" | "bottom";
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  backdrop?: boolean;
  tableName?: string;
  onClose: () => void;
}
