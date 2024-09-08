import { ReactNode } from "react";

export interface RowProps {
  item: Record<string, any>;
  columnConfig: ColumnConfigType[];
  dropdownActionsSlot?: (item: Record<string, any>) => ReactNode;
  canDelete?: boolean;
  isParanoid?: boolean;
  hasActions?: boolean;
  viewPath?: string;
  editPath?: string;
  blank?: boolean;
}
