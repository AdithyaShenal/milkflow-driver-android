import { useLottie } from "lottie-react";
import loadingAnimation from "../assets/Loading Dots.json";

const LoadingPage = () => {
  const options = {
    animationData: loadingAnimation,
    loop: true,
  };

  const { View } = useLottie(options);

  return (
    <div className="flex justify-center items-center h-screen w-screen">
      <div className="w-80 h-80">{View}</div>
    </div>
  );
};

export default LoadingPage;
