export interface AttendanceForecast {
  based_on_events: number;
  historical_average: number;
  forecast: number;
  note: string;
}

export interface ResourceForecastItem {
  resource_name: string;
  average_allocated: number;
  forecast_needed: number;
}

export interface ResourceForecast {
  based_on_events: number;
  items: ResourceForecastItem[];
}

export interface BudgetForecast {
  based_on_events: number;
  historical_average_expense: number;
  forecast: number;
  note: string;
}