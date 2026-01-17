import { Card, Badge, Button } from "konsta/react";
import type { Route } from "../../hooks/useFetchRoutes";

interface Props {
  onCardClick: () => void;
  routeProps: Route;
  error: string | null;
  isLoading: boolean;
  isActive: boolean;
}

const RouteCardActive = ({
  onCardClick,
  routeProps,
  error,
  isLoading,
  isActive,
}: Props) => {
  return (
    <>
      <Card raised>
        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <div className="text-lg font-semibold">{routeProps.license_no}</div>

          <Badge
            className={`p-2 uppercase text-xs font-semibold ${
              routeProps.status === "pending"
                ? "k-color-brand-yellow"
                : routeProps.status === "awaiting pickup"
                ? "k-color-brand-primary"
                : routeProps.status === "collected"
                ? "k-color-brand-green"
                : routeProps.status === "failed"
                ? "k-color-brand-red"
                : "k-color-brand-gray"
            }`}
          >
            {routeProps.status}
          </Badge>
        </div>

        {/* Stats */}
        <div className="divide-y divide-gray-200 text-sm">
          <div className="flex justify-between py-2">
            <span className="text-gray-600">Total stops</span>
            <span className="font-medium">{routeProps.stops.length - 2}</span>
          </div>

          <div className="flex justify-between py-2">
            <span className="text-gray-600">Total load</span>
            <span className="font-medium">{routeProps.load} L</span>
          </div>

          <div className="flex justify-between py-2">
            <span className="text-gray-600">Distance</span>
            <span className="font-medium">
              {(routeProps.distance / 1000).toFixed(1)} km
            </span>
          </div>
        </div>

        <Button rounded onClick={onCardClick}>
          {isActive ? "Access" : isLoading ? "Activating..." : "Activate"}
        </Button>

        {error && (
          <p className="mt-1 font-bold text-red-500 text-sm">{error}</p>
        )}
      </Card>
    </>
  );
};

export default RouteCardActive;
