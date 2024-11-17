import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const LayoutComponent = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      navigate("/login");
    }
  }, []);

  return (
    <>
      <h1>Layout</h1>
      <Outlet />
    </>
  );
};

export default LayoutComponent;
