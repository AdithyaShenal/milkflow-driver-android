import { Block } from "konsta/react";
import { CheckCircle } from "lucide-react";

const RouteCompletedCard = () => {
  return (
    <Block
      strong
      inset
      className="shadow-lg rounded-3xl bg-linear-to-br from-green-500 to-green-600 p-8"
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
          <CheckCircle size={40} className="text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">
            Route Completed!
          </h3>
          <p className="text-white/90 text-sm">
            All pickups have been successfully completed
          </p>
        </div>
      </div>
    </Block>
  );
};

export default RouteCompletedCard;
