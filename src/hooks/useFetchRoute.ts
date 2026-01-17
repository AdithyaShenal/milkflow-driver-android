import { useQuery } from "@tanstack/react-query";
import type { APIError, Route } from "./useFetchRoutes";
import type { AxiosError } from "axios";
import axios from "axios";

const useFetchRoute = (routeId: string) => {
  return useQuery<Route, AxiosError<APIError>>({
    queryKey: ["route", routeId],
    queryFn: () =>
      axios
        .get<Route>(
          `https://mclros-backend-2.onrender.com/api/routing/routes/${routeId}`
        )
        .then((res) => res.data),

    enabled: !!routeId,
  });
};

export default useFetchRoute;
