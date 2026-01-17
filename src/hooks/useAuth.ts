import { useQuery } from "@tanstack/react-query";
import { api } from "../service/apiClient";
import type { AxiosError } from "axios";
import { Preferences } from "@capacitor/preferences";

interface DriverData {
  _id: string;
  name: string;
  status: string;
  driver_license_no: string;
  shortName: string;
  pinNo: string;
}

export function useAuth() {
  return useQuery<DriverData, AxiosError>({
    queryKey: ["auth", "user"],
    queryFn: async () => {
      // Check if token exists before making request
      const { value: token } = await Preferences.get({
        key: "authToken",
      });

      if (!token) {
        throw new Error("No authentication token found");
        // console.log("Token not found on local");
      }

      const { data } = await api.get<DriverData>("/auth/driver/me");
      return data;
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    // Only fetch if we might have a token
    enabled: true,
  });
}
