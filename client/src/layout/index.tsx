import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
const LayoutComponent = () => {
  const token = Cookies.get("token");

  if (token) {
    return (
      <>
        <div className="w-full h-screen flex flex-col">
          <Navbar />
          <div className="flex flex-row overflow-y-hidden">
            <Sidebar />
            <div className="w-[85%] p-4 2xl:px-10 overflow-y-auto">
              <Outlet />
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return <Navigate to="/login" />;
  }
};

export default LayoutComponent;
