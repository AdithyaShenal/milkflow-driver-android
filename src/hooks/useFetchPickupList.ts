import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { APIError, Route } from "./useFetchRoutes";
import { api } from "../service/apiClient";

const useFetchPickupList = (routeId: string) => {
  return useQuery<Route, AxiosError<APIError>>({
    queryKey: ["route", routeId],
    queryFn: () =>
      api.get<Route>(`/routing/routes/${routeId}`).then((res) => res.data),
  });
};

export default useFetchPickupList;
