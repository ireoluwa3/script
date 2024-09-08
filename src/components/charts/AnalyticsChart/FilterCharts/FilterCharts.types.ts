export interface FilterChartsProps {
  availableFilters: AvailableFilters;
  filterResults: {
    [key: string]: {
      [filterValue: string]: {
        count: number;
        change: number;
        percentage: number;
      };
    };
  };
  timeframe: {
    value: string;
    label: string;
  };
  cardName: string;
  modelName: string;
  timeframes: {
    value: string;
    label: string;
    text: string;
  }[];
}
