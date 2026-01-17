import { Card, Badge } from "konsta/react";
import type { Route } from "../../hooks/useFetchRoutes";

interface Props {
  routeProps: Route;
}

const RouteCard = ({ routeProps }: Props) => {
  return (
    <Card raised className="mb-3">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <div className="text-lg font-semibold">{routeProps.license_no}</div>

        <Badge className="uppercase text-xs font-semibold k-color-brand-green p-2">
          {routeProps.status}
        </Badge>
      </div>

      {/* Stats */}
      <div className="divide-y divide-gray-200 text-sm">
        <div className="flex justify-between py-2">
          <span className="text-gray-600">Total stops</span>
          <span className="font-medium">{routeProps.stops.length}</span>
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
    </Card>
  );
};

export default RouteCard;
