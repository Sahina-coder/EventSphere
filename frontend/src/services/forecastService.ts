import api from "./api";
import type { AttendanceForecast, ResourceForecast, BudgetForecast } from "../types/forecast";

export const getAttendanceForecast = async (): Promise<AttendanceForecast> => {
  const res = await api.get("/forecast/attendance");
  return res.data;
};

export const getResourceForecast = async (): Promise<ResourceForecast> => {
  const res = await api.get("/forecast/resources");
  return res.data;
};

export const getBudgetForecast = async (): Promise<BudgetForecast> => {
  const res = await api.get("/forecast/budget");
  return res.data;
};