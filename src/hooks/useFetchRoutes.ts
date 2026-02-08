import { useQuery } from "@tanstack/react-query";
import { type AxiosError } from "axios";
import { api } from "../service/apiClient";

interface Farmer {
  _id: string;
  address: string;
  location: {
    lat: number;
    lon: number;
  };
  name: string;
  route: number;
  updatedAt: string;
  createdAt: string;
  phone: string;
}

export interface Production {
  _id: string;
  volume: number;
  farmer: Farmer;
  status: string;
  registration_time: string;
  failure_reason?: string;
  collectedVolume?: number;
  blocked: boolean;
}

export interface Stop {
  _id: string;
  load_after_visit: number;
  node: number;
  order: number;
  production: Production | null;
}

export interface Route {
  _id: string;
  distance: number;
  stops: Stop[];
  vehicle_id: number;
  license_no: string;
  load: number;
  status: string;
  active: boolean;
}

export interface APIError {
  message: string;
  code?: string;
  details?: string;
  status: number;
}

export const useFetchRoutes = (driver_id: string) =>
  useQuery<Route[], AxiosError<APIError>>({
    queryKey: ["routes"],
    queryFn: async () => {
      const res = await api.get<Route[]>(
        `/routing/routes/pending_routes/${driver_id}`,
      );

      return res.data;
    },

    enabled: !!driver_id,
  });
