import { useNavigate, useParams } from "react-router-dom";
import { Toast } from "@capacitor/toast";
import { Block, Button, Preloader } from "konsta/react";
import StopCard from "../components/cards/StopCard";
import CancelSection from "../components/CancelSection";
import RouteCompletedCard from "../components/cards/RouteCompletedCard";
import useFetchRoute from "../hooks/useFetchRoute";
import LoadingPage from "./LoadingPage";
import { useEffect } from "react";
import useRouteComplete from "../hooks/useRouteComplete";
import MapLibreComponent from "../components/MapLibre/MapLibreComponent";

export interface APIError {
  message: string;
  code?: string;
  details?: string;
  status: number;
}

const ActiveRoutePage = () => {
  const navigate = useNavigate();
  const { routeId } = useParams();

  const {
    data: route,
    isError,
    error,
    isLoading,
  } = useFetchRoute(routeId || "");

  const { mutate: completeMutate, isPending } = useRouteComplete(routeId || "");

  useEffect(() => {
    if (isError) {
      Toast.show({
        text: error?.response?.data.message ?? "Something went wrong",
        duration: "short",
        position: "bottom",
      });
    }
  }, [isError, error]);

  if (!route || isLoading) return <>{<LoadingPage />}</>;

  // Exclude depot stops (first and last)
  const actionableStops = route.stops.slice(1, -1);

  // Find the next stop that is awaiting pickup
  const currentStop =
    actionableStops.find(
      (stop) => stop.production?.status === "awaiting pickup",
    ) || null;

  // Route is complete if no actionable stops left
  const routeComplete = currentStop === null;

  return (
    <>
      <div className="flex flex-col gap-2 mb-20 relative">
        <div className="h-80 z-0">
          <MapLibreComponent route={route} currentStop={currentStop} />
        </div>
        <Block inset nested className="flex justify-center items-center">
          <Button
            className="bg-black/50 w-22 text-xs"
            rounded
            onClick={() => {
              navigate("/fullMap", { state: { route, currentStop } });
            }}
          >
            Open Map
          </Button>
        </Block>

        {!routeComplete && currentStop && routeId && (
          <StopCard stopData={currentStop} routeId={routeId} />
        )}

        {route.status === "completed" && <RouteCompletedCard />}

        {/* Completion button */}
        {route.status !== "completed" && routeComplete && (
          <Block inset strong>
            <Button
              disabled={isPending}
              className="k-color-brand-green"
              onClick={() => {
                completeMutate();
              }}
            >
              {!isPending && "Mark as Complete"}
              {isPending && <Preloader />}
            </Button>
          </Block>
        )}

        <Block inset strong nested className="mb-3">
          <Button
            rounded
            onClick={() => {
              navigate("/pickupList", { state: { routeId } });
            }}
          >
            Pickup List
          </Button>
        </Block>

        {routeId && <CancelSection routeId={routeId} />}
      </div>
    </>
  );
};

export default ActiveRoutePage;
