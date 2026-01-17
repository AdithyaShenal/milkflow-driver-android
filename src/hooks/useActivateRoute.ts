import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import type { APIError } from "./useFetchRoutes";

const useActivateRoute = () => {
  return useMutation<unknown, AxiosError<APIError>, string>({
    mutationFn: (routeId: string) =>
      axios
        .post(
          "https://mclros-backend-2.onrender.com/api/routing/routes/activate",
          {
            driver_id: "6935c6c814f7764f6bf9518c",
            route_id: routeId,
          }
        )
        .then((res) => res.data),
  });
};

export default useActivateRoute;
