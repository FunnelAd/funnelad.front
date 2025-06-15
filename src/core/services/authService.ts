import { api } from "@/core/api";
import type { AuthResponse } from "@/core/types/auth";

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    // console.log('Login attempt with email:', email);
    // console.log('Login attempt with password:', password);
    // const response = await api.post(
    //   "https://funnelad-api.onrender.com/api/users/login",
    //   { email, password }
    // );

    const response = await api.post("/api/users/login", { email, password });
    console.log("Login response:", response);

    return response.data as AuthResponse; 
  },

  async verifyToken(): Promise<AuthResponse> {
    const response = await api.get("/auth/verify");
    return response.data as AuthResponse;
  },
};
