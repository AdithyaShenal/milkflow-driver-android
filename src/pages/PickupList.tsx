import StopCardNormal from "../components/cards/StopCardNormal";
import { useLocation } from "react-router-dom";
import { List, AlertCircle } from "lucide-react";
import useFetchPickupList from "../hooks/useFetchPickupList";
import LoadingPage from "./LoadingPage";
import { Block } from "konsta/react";

const PickupList = () => {
  const { state } = useLocation();
  const routeId = state.routeId;

  const {
    data: route,
    isError,
    error,
    isLoading,
  } = useFetchPickupList(routeId);

  const slicedArray = route?.stops.slice(1, -1);

  if (isLoading) return <LoadingPage />;

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Page Header */}
      <Block inset strong className="shadow-lg rounded-3xl bg-white p-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-sky-50 rounded-xl flex items-center justify-center">
            <List size={24} className="text-sky-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Pickup List</h1>
            <p className="text-sm text-slate-500">
              {slicedArray?.length || 0} stop
              {slicedArray?.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </Block>

      {/* Error State */}
      {isError && (
        <Block inset strong className="shadow-lg rounded-3xl bg-red-50 p-6">
          <div className="flex items-start gap-3">
            <AlertCircle size={20} className="text-red-500 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-600 mb-1">Error</p>
              <p className="text-sm text-red-700">
                {error?.response?.data.message}
              </p>
            </div>
          </div>
        </Block>
      )}

      {/* Stops List */}
      {slicedArray && slicedArray.length > 0 && (
        <div className="space-y-3">
          {slicedArray.map((stop) => (
            <div key={stop._id}>
              <StopCardNormal stopData={stop} />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {slicedArray && slicedArray.length === 0 && (
        <Block inset strong className="shadow-lg rounded-3xl bg-white p-8">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center">
              <List size={32} className="text-slate-400" />
            </div>
            <p className="text-slate-500 font-medium">No stops in this route</p>
          </div>
        </Block>
      )}
    </div>
  );
};

export default PickupList;
