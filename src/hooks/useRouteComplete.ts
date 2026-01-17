import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import type { APIError } from "./useFetchRoutes";
import { Toast } from "@capacitor/toast";

const useRouteComplete = (routeId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      axios.post(
        `https://mclros-backend-2.onrender.com/api/routing/routes/complete/${routeId}`,
        { driver_id: "6935c6c814f7764f6bf9518c" }
      ),
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
