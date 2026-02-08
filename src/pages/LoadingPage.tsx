import { Preloader } from "konsta/react";

const LoadingPage = () => {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <Preloader />
        <p className="text-sm font-medium text-slate-600">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingPage;
