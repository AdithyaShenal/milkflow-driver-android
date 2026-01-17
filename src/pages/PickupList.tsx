import StopCardNormal from "../components/cards/StopCardNormal";
import { useLocation } from "react-router-dom";
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

  if (isLoading) return <>{<LoadingPage />}</>;

  return (
    <>
      <div className="flex flex-col gap-2 mt-4">
        <Block inset strong nested>
          <p>Pickup List</p>
        </Block>

        {isError && (
          <Block inset strong nested>
            <p className="text-slate-400">
              <i>{error?.response?.data.message}</i>
            </p>
          </Block>
        )}

        <ul>
          {slicedArray &&
            slicedArray.map((stop) => (
              <li key={stop._id}>
                <StopCardNormal stopData={stop} />
              </li>
            ))}
        </ul>
      </div>
    </>
  );
};

export default PickupList;
