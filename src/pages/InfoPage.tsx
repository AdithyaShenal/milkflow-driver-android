import { Block } from "konsta/react";
import { CheckCircle, AlertCircle } from "lucide-react";
import RouteCard from "../components/cards/RouteCard";
import useFetchCompleted from "../hooks/useFetchCompleted";
import LoadingPage from "./LoadingPage";

const InfoPage = () => {
  const driverId = "6935c6c814f7764f6bf9518c";

  const {
    data: routes,
    isError,
    error,
    isLoading,
  } = useFetchCompleted(driverId);

  if (isLoading) return <LoadingPage />;

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Page Header */}
      <Block inset strong className="shadow-lg rounded-3xl bg-white p-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
            <CheckCircle size={24} className="text-green-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">
              Completed Routes
            </h1>
            <p className="text-sm text-slate-500">
              {routes?.length || 0} route{routes?.length !== 1 ? "s" : ""}{" "}
              completed
            </p>
          </div>
        </div>
      </Block>

      {/* Empty State */}
      {routes?.length === 0 && (
        <Block inset strong className="shadow-lg rounded-3xl bg-white p-8">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center">
              <CheckCircle size={32} className="text-slate-400" />
            </div>
            <p className="text-slate-500 font-medium">
              No completed routes yet
            </p>
            <p className="text-sm text-slate-400">
              Completed routes will appear here
            </p>
          </div>
        </Block>
      )}

      {/* Error State */}
      {isError && (
        <Block inset strong className="shadow-lg rounded-3xl bg-red-50 p-6">
          <div className="flex items-start gap-3">
            <AlertCircle size={20} className="text-red-500 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-600 mb-1">Error</p>
              <p className="text-sm text-red-700">
                {error.response?.data.message}
              </p>
            </div>
          </div>
        </Block>
      )}

      {/* Routes List */}
      {routes && routes.length > 0 && (
        <div className="space-y-3">
          {routes.map((route) => (
            <RouteCard key={route._id} routeProps={route} />
          ))}
        </div>
      )}
    </div>
  );
};

export default InfoPage;
