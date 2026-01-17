import { Navigate, Outlet, useLocation } from "react-router-dom";
import NavBar from "../components/NavBar";
import TabBar from "../components/TabBar";
import { useAuth } from "../hooks/useAuth";
import LoadingPage from "../pages/LoadingPage";

const PrivateLayout = () => {
  const { data: user, isLoading, isError } = useAuth();

  const location = useLocation();

  if (isLoading) return <div>{<LoadingPage />}</div>;

  // Redirect to login if not authenticated
  if (!user && isError) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <div className="h-dvh flex flex-col">
        {location.pathname !== "/fullMap" && (
          <nav>
            <NavBar />
          </nav>
        )}
        <div className="flex-1">
          <Outlet />
        </div>
        {location.pathname !== "/fullMap" && (
          <footer>
            <TabBar></TabBar>
          </footer>
        )}
      </div>
    </>
  );
};

export default PrivateLayout;
