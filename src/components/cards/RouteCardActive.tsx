import { Block, Button, Chip, Preloader } from "konsta/react";
import { Truck, MapPin, Droplet, Route as RouteIcon } from "lucide-react";
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
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-500";
      case "in progress":
        return "bg-sky-600";
      case "completed":
        return "bg-green-500";
      default:
        return "bg-slate-500";
    }
  };

  return (
    <Block strong inset className="shadow-lg rounded-3xl bg-white p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-sky-50 rounded-xl flex items-center justify-center">
            <Truck size={24} className="text-sky-600" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase mb-1">
              Vehicle
            </p>
            <p className="text-lg font-bold text-slate-800">
              {routeProps.license_no}
            </p>
          </div>
        </div>
        <Chip
          className={`${getStatusColor(
            routeProps.status,
          )} text-white px-3 py-1 text-xs font-semibold uppercase`}
        >
          {routeProps.status}
        </Chip>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="p-3 bg-slate-50 rounded-xl text-center">
          <MapPin size={20} className="text-slate-600 mx-auto mb-2" />
          <p className="text-xs font-semibold text-slate-500 uppercase mb-1">
            Stops
          </p>
          <p className="text-lg font-bold text-slate-800">
            {routeProps.stops.length - 2}
          </p>
        </div>

        <div className="p-3 bg-sky-50 rounded-xl text-center">
          <Droplet size={20} className="text-sky-600 mx-auto mb-2" />
          <p className="text-xs font-semibold text-slate-500 uppercase mb-1">
            Load
          </p>
          <p className="text-lg font-bold text-slate-800">{routeProps.load}L</p>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl text-center">
          <RouteIcon size={20} className="text-slate-600 mx-auto mb-2" />
          <p className="text-xs font-semibold text-slate-500 uppercase mb-1">
            Distance
          </p>
          <p className="text-lg font-bold text-slate-800">
            {(routeProps.distance / 1000).toFixed(1)}km
          </p>
        </div>
      </div>

      {/* Action Button */}
      <Button
        rounded
        raised
        large
        style={{ backgroundColor: "#0284c7" }}
        className="w-full text-white h-12 font-semibold shadow-md disabled:opacity-70"
        onClick={onCardClick}
        disabled={isLoading}
      >
        {isLoading ? (
          <Preloader className="w-5 h-5" />
        ) : isActive ? (
          "Access Route"
        ) : (
          "Activate Route"
        )}
      </Button>

      {/* Error Message */}
      {error && (
        <div className="mt-3 p-3 bg-red-50 rounded-xl">
          <p className="text-sm text-red-600 font-medium">{error}</p>
        </div>
      )}
    </Block>
  );
};

export default RouteCardActive;
