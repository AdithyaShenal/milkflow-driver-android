import { Block } from "konsta/react";
import { CircleCheck } from "lucide-react";

const RouteCompletedCard = () => {
  return (
    <>
      <Block inset strong nested className="rounded-full k-color-brand-green">
        <div
          className="
            bg-green-700
            rounded-full
            flex
            items-center
            justify-center
            text-white
            gap-4
            h-20
            
            "
        >
          <CircleCheck />
          <p>Route Completed</p>
        </div>
      </Block>
    </>
  );
};

export default RouteCompletedCard;
