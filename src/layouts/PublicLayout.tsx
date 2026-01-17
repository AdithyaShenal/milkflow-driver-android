import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import LoadingPage from "../pages/LoadingPage";

const PublicLayout = () => {
  const { data: user, isLoading, isError } = useAuth();

  if (isLoading) return <div>{<LoadingPage />}</div>;

  // Redirect to private if already authenticated
  if (!!user && !isError) {
    return <Navigate to="/routes" replace />;
  }

  return (
    <>
      <div>
        <Outlet />
      </div>
    </>
  );
};

export default PublicLayout;
