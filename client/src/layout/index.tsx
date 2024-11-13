import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const LayoutComponent = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
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
