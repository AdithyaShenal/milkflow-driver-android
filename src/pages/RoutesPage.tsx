import { useEffect, useState } from "react";
import RouteCardActive from "../components/cards/RouteCardActive";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useFetchRoutes } from "../hooks/useFetchRoutes";
import { useNavigate } from "react-router-dom";
import { Toast } from "@capacitor/toast";
import { Block } from "konsta/react";
import { MapPin } from "lucide-react";
import LoadingPage from "./LoadingPage";
import { api } from "../service/apiClient";

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

  const {
    mutateAsync,
    isPending,
    isError: isActivationError,
    error: activationError,
  } = useMutation({
    mutationFn: (routeId: string) =>
      api
        .post("/routing/routes/activate", {
          driver_id: "6935c6c814f7764f6bf9518c",
          route_id: routeId,
        })
        .then((res) => res.data),

    onError: (error: AxiosError<APIError>, routeId: string) => {
      setErrorRouteId(routeId);
      setCardError(error.response?.data.message ?? "Unknown Error");
    },
  });

  useEffect(() => {
    if (isError) {
      Toast.show({
        text: error.response?.data.message ?? "Something went wrong",
        duration: "short",
        position: "bottom",
      });
    }

    if (isActivationError) {
      Toast.show({
        text: activationError.response?.data.message ?? "Something went wrong",
        duration: "short",
        position: "bottom",
      });
    }
  }, [isError, isActivationError]);

  if (isLoading) return <LoadingPage />;

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Page Header */}
      <Block inset strong className="shadow-lg rounded-3xl bg-white p-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-sky-50 rounded-xl flex items-center justify-center">
            <MapPin size={24} className="text-sky-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Pending Routes</h1>
            <p className="text-sm text-slate-500">
              {routes?.length || 0} route{routes?.length !== 1 ? "s" : ""}{" "}
              available
            </p>
          </div>
        </div>
      </Block>

      {/* Empty State */}
      {routes?.length === 0 && (
        <Block inset strong className="shadow-lg rounded-3xl bg-white p-8">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center">
              <MapPin size={32} className="text-slate-400" />
            </div>
            <p className="text-slate-500 font-medium">
              No routes dispatched yet
            </p>
            <p className="text-sm text-slate-400">
              Check back later for new routes
            </p>
          </div>
        </Block>
      )}

      {/* Routes List */}
      {routes && routes.length > 0 && (
        <div className="space-y-3">
          {routes.map((route) => (
            <RouteCardActive
              key={route._id}
              isActive={route.active}
              isLoading={loadingRouteId === route._id && isPending}
              error={errorRouteId === route._id ? cardError : null}
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
          ))}
        </div>
      )}
    </div>
  );
};

export default RoutesPage;
