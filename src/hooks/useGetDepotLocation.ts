import { useQuery } from "@tanstack/react-query";
import { api } from "../service/apiClient";
import type { AxiosError } from "axios";
import type { APIError } from "./useFetchRoutes";

interface DepotLocationProps {
  lat: number;
  lon: number;
}

const useGetDepotLocation = () => {
  return useQuery<DepotLocationProps, AxiosError<APIError>>({
    queryKey: ["depotLocation"],
    queryFn: async () => {
      const res = await api.get("/config/depotLocation");
      return res.data;
    },
  });
};

export default useGetDepotLocation;
