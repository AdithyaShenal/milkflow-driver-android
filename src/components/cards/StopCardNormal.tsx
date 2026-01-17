import { Card, Badge } from "konsta/react";
import type { Stop } from "../../hooks/useFetchRoutes";

interface Props {
  stopData: Stop;
}

const STATUS_COLOR: Record<
  string,
  "yellow" | "primary" | "green" | "red" | "gray"
> = {
  pending: "yellow",
  "awaiting pickup": "primary",
  collected: "green",
  failed: "red",
};

const StopCardNormal = ({ stopData }: Props) => {
  return (
    <Card raised className="mb-3">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="text-xs text-gray-500">Next Stop</div>
          <div className="text-lg font-semibold">#{stopData.order - 1}</div>
        </div>

        <Badge
          className={`p-2 uppercase text-xs font-semibold "k-color-brand-${STATUS_COLOR[status]}`}
        >
          {stopData.production?.status}
        </Badge>
      </div>

      {/* Farmer */}
      <div className="mb-3">
        <div className="text-xs text-gray-500 mb-0.5">Farmer</div>
        <div className="text-base font-semibold">
          {stopData.production?.farmer.name}
        </div>
      </div>

      {/* Address */}
      <div className="mb-4">
        <div className="text-xs text-gray-500 mb-0.5">Address</div>
        <div className="text-sm text-gray-700 line-clamp-2">
          {stopData.production?.farmer.address}
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center">
        <div>
          <div className="text-xs text-gray-500">Total Volume</div>
          <div className="text-2xl font-bold">
            {stopData.production?.volume}L
          </div>
        </div>

        <div>
          <div className="text-xs text-gray-500">Tel</div>
          <div className="font-bold">{stopData.production?.farmer.phone}</div>
        </div>
      </div>
    </Card>
  );
};

export default StopCardNormal;
