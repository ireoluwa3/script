export interface MainChartProps {
  availableFilters: AvailableFilters;
  filters: {
    [key: string]: string;
  };
  handleFilterChange: (key: string, selection: { value: string }) => void;
  data: {
    date: string;
    count: number;
  }[];
  color: string;
  timeframe: {
    value: string;
    label: string;
  };
  setTimeframe: (timeframe: { value: string; label: string }) => void;
  timeframes: {
    value: string;
    label: string;
  }[];
}
