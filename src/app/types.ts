export type Interval = "daily" | "weekly" | "monthly";

export interface DataItem {
  DID: string;
  tem1: number;
  hum1: number;
}

export interface GenerateXAxisData {
  (limit: number): string[];
}

export interface DataVisualizationProps {
  data: DataItem[];
  interval: Interval;
}

export interface FormData {
  email: string;
  password: string;
}

export interface LoginResponse {
  data: {
    accessToken: string;
  };
}
