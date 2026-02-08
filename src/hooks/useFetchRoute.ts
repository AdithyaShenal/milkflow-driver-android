import { useQuery } from "@tanstack/react-query";
import type { APIError, Route } from "./useFetchRoutes";
import type { AxiosError } from "axios";
import { api } from "../service/apiClient";

const useFetchRoute = (routeId: string) => {
  return useQuery<Route, AxiosError<APIError>>({
    queryKey: ["route", routeId],
    queryFn: () =>
      api.get<Route>(`/routing/routes/${routeId}`).then((res) => res.data),

    enabled: !!routeId,
  });
};

export default useFetchRoute;
