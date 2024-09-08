export interface HeadProps {
  columnConfig: ColumnConfigType[];
  hasActions: boolean;
  canDelete?: boolean;
  dynamicColumnWidths: { width: number; minWidth: string }[];
}
