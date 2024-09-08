export interface TickerProps {}

export interface Trade {
  price: number;
  amount: number;
  time: string;
  side: "buy" | "sell";
}
