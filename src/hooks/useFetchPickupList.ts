import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { APIError, Route } from "./useFetchRoutes";
import axios from "axios";

const useFetchPickupList = (routeId: string) => {
  return useQuery<Route, AxiosError<APIError>>({
    queryKey: ["route", routeId],
    queryFn: () =>
      axios
        .get<Route>(
          `https://mclros-backend-2.onrender.com/api/routing/routes/${routeId}`
        )
        .then((res) => res.data),
  });
};

export default useFetchPickupList;
