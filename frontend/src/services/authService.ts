import api from "./api";

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export const registerUser = async (name: string, email: string, password: string, role: string): Promise<AuthResponse> => {
  const res = await api.post("/auth/register", { name, email, password, role });
  return res.data;
};

export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
  const res = await api.post("/auth/login", { email, password });
  return res.data;
};

export const getMe = async (token: string): Promise<User> => {
  const res = await api.get("/auth/me", { headers: { Authorization: `Bearer ${token}` } });
  return res.data;
};