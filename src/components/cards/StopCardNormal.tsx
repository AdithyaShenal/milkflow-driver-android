import { Block, Chip } from "konsta/react";
import { MapPin, Phone, Droplet } from "lucide-react";
import type { Stop } from "../../hooks/useFetchRoutes";

interface Props {
  stopData: Stop;
  stopNumber?: number;
}

const StopCardNormal = ({ stopData, stopNumber }: Props) => {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-500";
      case "awaiting pickup":
        return "bg-sky-600";
      case "collected":
        return "bg-green-500";
      case "failed":
        return "bg-red-500";
      default:
        return "bg-slate-500";
    }
  };

  return (
    <Block strong inset className="shadow-lg rounded-3xl bg-white p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase mb-1">
            Stop {stopNumber ? `#${stopNumber}` : `#${stopData.order - 1}`}
          </p>
          <p className="text-lg font-bold text-slate-800">
            {stopData.production?.farmer.name}
          </p>
        </div>
        <Chip
          className={`${getStatusColor(
            stopData.production?.status,
          )} text-white px-3 py-1 text-xs font-semibold uppercase`}
        >
          {stopData.production?.status}
        </Chip>
      </div>

      {/* Info Grid */}
      <div className="space-y-3">
        <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
          <MapPin size={18} className="text-slate-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-500 uppercase mb-1">
              Address
            </p>
            <p className="text-sm text-slate-700 line-clamp-2">
              {stopData.production?.farmer.address}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 p-3 bg-sky-50 rounded-xl">
            <Droplet size={18} className="text-sky-600 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">
                Volume
              </p>
              <p className="text-lg font-bold text-slate-800">
                {stopData.production?.volume}L
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl">
            <Phone size={18} className="text-slate-600 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-500 uppercase">
                Phone
              </p>
              <p className="text-sm font-bold text-slate-800 truncate">
                {stopData.production?.farmer.phone}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Block>
  );
};

export default StopCardNormal;
