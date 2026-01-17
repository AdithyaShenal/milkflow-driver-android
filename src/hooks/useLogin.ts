import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../service/apiClient";
import type { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { Preferences } from "@capacitor/preferences";

interface Credentials {
  shortName: string;
  pinNo: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
}

interface ApiError {
  message: string;
  status: number;
  details: string;
  code: string;
}

export function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation<LoginResponse, AxiosError<ApiError>, Credentials>({
    mutationFn: async (credentials: Credentials) => {
      const { data } = await api.post<LoginResponse>(
        "/auth/driver/login",
        credentials
      );
      return data;
    },
    onSuccess: async (data) => {
      await Preferences.set({
        key: "authToken",
        value: data.token,
      });

      queryClient.invalidateQueries({ queryKey: ["auth", "user"] });

      navigate("/routes");
    },
  });
}
