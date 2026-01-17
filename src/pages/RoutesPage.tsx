import { useState } from "react";
import RouteCardActive from "../components/cards/RouteCardActive";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useFetchRoutes } from "../hooks/useFetchRoutes";
import { useNavigate } from "react-router-dom";
import { Toast } from "@capacitor/toast";
import { Block } from "konsta/react";
import LoadingPage from "./LoadingPage";

interface APIError {
  message: string;
  code?: string;
  details?: string;
  status: number;
}

const RoutesPage = () => {
  const navigate = useNavigate();
  const [cardError, setCardError] = useState<string | null>(null);
  const [errorRouteId, setErrorRouteId] = useState<string | null>(null);
  const [loadingRouteId, setLoadingRouteId] = useState<string | null>(null);

  const {
    data: routes,
    isError,
    error,
    isLoading,
  } = useFetchRoutes("6935c6c814f7764f6bf9518c");

  const { mutateAsync, isPending } = useMutation({
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

    onError: (error: AxiosError<APIError>, routeId: string) => {
      setErrorRouteId(routeId);
      setCardError(error.response?.data.message ?? "Unknown Error");
    },
  });

  if (isLoading) return <>{<LoadingPage />}</>;

  if (isError) {
    Toast.show({
      text: error.response?.data.message ?? "Something went wrong",
      duration: "short",
      position: "bottom",
    });
  }

  return (
    <>
      <div className="mb-20">
        <div className="flex flex-col gap-2 mt-4">
          <Block inset strong nested>
            <p>Pending Routes</p>
          </Block>

          {routes?.length === 0 && (
            <Block inset strong nested>
              <p className="text-slate-400">
                <i>No routes dispatched yet.</i>
              </p>
            </Block>
          )}

          <ul>
            {routes?.map((route) => (
              <li key={route._id}>
                <RouteCardActive
                  isActive={route.active}
                  isLoading={loadingRouteId === route._id && isPending}
                  error={errorRouteId === route._id ? cardError : null}
                  key={route.license_no}
                  onCardClick={async () => {
                    if (!route.active) {
                      setLoadingRouteId(route._id);
                      await mutateAsync(route._id);
                      navigate(`/activeRoute/${route._id}`);
                    }
                    if (route.active) {
                      navigate(`/activeRoute/${route._id}`);
                    }
                  }}
                  routeProps={route}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default RoutesPage;
