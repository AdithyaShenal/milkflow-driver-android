import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import type { APIError } from "./useFetchRoutes";
import { Toast } from "@capacitor/toast";
import { api } from "../service/apiClient";

const useRouteComplete = (routeId: string) => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError<APIError>>({
    mutationFn: () =>
      api.post(`/routing/routes/complete/${routeId}`, {
        driver_id: "6935c6c814f7764f6bf9518c",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["route", routeId] });
      queryClient.invalidateQueries({ queryKey: ["routes"] });
    },

    onError: (error: AxiosError<APIError>) => {
      Toast.show({
        text: error.response?.data.message ?? "Something went wrong",
        duration: "short",
      });
    },
  });
};

export default useRouteComplete;
