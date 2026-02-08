import type { AxiosError } from "axios";
import type { APIError, Route } from "./useFetchRoutes";
import { useQuery } from "@tanstack/react-query";
import { api } from "../service/apiClient";

const useFetchCompleted = (driverId: string) => {
  return useQuery<Route[], AxiosError<APIError>>({
    queryKey: ["routes", "completed", driverId],
    queryFn: () =>
      api.get(`/routing/routes/driver/${driverId}`).then((res) => res.data),

    enabled: !!driverId,
  });
};

export default useFetchCompleted;
