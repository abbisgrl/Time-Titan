import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import { userDetailsApi } from "../slices/auth/authSlices";
import { getProjectsListApi } from "../slices/project/projectSlices";
const LayoutComponent = () => {
  const token = Cookies.get("token");
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (token) {
      dispatch(userDetailsApi());
      dispatch(getProjectsListApi());
    }
  }, []);

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
