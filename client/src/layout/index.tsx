import { Outlet } from "react-router-dom";

const LayoutComponent = () => {
  return (
    <>
      <h1>Layout</h1>
      <Outlet />
    </>
  );
};

export default LayoutComponent;
