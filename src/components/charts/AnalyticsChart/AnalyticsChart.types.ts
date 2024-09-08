export interface AnalyticsChartProps {
  model: string;
  postTitle?: string;
  modelName: string;
  cardName?: string;
  availableFilters?: AvailableFilters;
  color?:
    | "default"
    | "contrast"
    | "muted"
    | "primary"
    | "success"
    | "info"
    | "warning"
    | "danger"
    | "yellow";
  params?: {
    [key: string]: any;
  };
  path?: string;
  pathModel?: boolean;
}
