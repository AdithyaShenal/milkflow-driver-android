import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import type { APIError } from "./useFetchRoutes";
import { api } from "../service/apiClient";

const useActivateRoute = () => {
  return useMutation<unknown, AxiosError<APIError>, string>({
    mutationFn: (routeId: string) =>
      api
        .post("/routing/routes/activate", {
          driver_id: "6935c6c814f7764f6bf9518c",
          route_id: routeId,
        })
        .then((res) => res.data),
  });
};

export default useActivateRoute;
