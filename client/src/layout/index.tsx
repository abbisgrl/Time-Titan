import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { userDetailsApi } from "../slices/auth/authSlices";
import { projectApi } from "../slices/project/projectSlices";
const LayoutComponent = () => {
  const token = Cookies.get("token");
  const dispatch = useDispatch<AppDispatch>();
  const sideBarExpanded = useSelector(
    (state: RootState) => state.navbarReducer.isSideMenuCollapsed
  );

  useEffect(() => {
    if (token) {
      dispatch(userDetailsApi());
      dispatch(projectApi.list());
    }
  }, []);

  if (token) {
    return (
      <>
        <div className="w-full h-screen flex flex-col">
          <Navbar />
          <div className="flex flex-row overflow-y-hidden">
            <Sidebar />
            <div
              className={`${
                !sideBarExpanded ? "w-[85%]" : "w-[95%]"
              } p-4 2xl:px-10 overflow-y-auto`}
            >
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
