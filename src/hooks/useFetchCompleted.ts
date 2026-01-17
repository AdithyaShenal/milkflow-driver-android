import type { AxiosError } from "axios";
import type { APIError, Route } from "./useFetchRoutes";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useFetchCompleted = (driverId: string) => {
  return useQuery<Route[], AxiosError<APIError>>({
    queryKey: ["routes", "completed", driverId],
    queryFn: () =>
      axios
        .get(
          `https://mclros-backend-2.onrender.com/api/routing/routes/driver/${driverId}`
        )
        .then((res) => res.data),

    enabled: !!driverId,
  });
};

export default useFetchCompleted;
