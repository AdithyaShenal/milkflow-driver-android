import { Block } from "konsta/react";
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

  if (isLoading) return <>{<LoadingPage />}</>;
  return (
    <>
      <div className="mb-20">
        <div className="flex flex-col gap-2 mt-4">
          <Block inset strong nested>
            <p>Completed Routes</p>
          </Block>

          {routes?.length === 0 && (
            <Block inset strong nested>
              <p className="text-slate-400">
                <i>No completed routes yet.</i>
              </p>
            </Block>
          )}

          {isError && (
            <Block inset strong nested className="k-color-brand-red">
              <p className="text-slate-400">{error.response?.data.message}</p>
            </Block>
          )}

          <ul>
            {routes?.map((route) => (
              <li key={route._id}>
                <RouteCard routeProps={route} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default InfoPage;
