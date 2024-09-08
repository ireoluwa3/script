export interface ServiceStatus {
  service: string;
  label: string;
  status: "Up" | "Down" | "Loading";
  message: string;
  timestamp: string;
}

export interface StatusProps {
  data: { [key: string]: ServiceStatus };
}
