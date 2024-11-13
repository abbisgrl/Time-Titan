import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LayoutComponent from "../layout/index.tsx";
import Dashboard from "../features/dashboard/index.tsx";
import Login from "../features/auth/login.tsx";

const RoutesComponent = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <LayoutComponent />,
      //   loader: rootLoader,
      children: [
        {
          path: "/dashboard",
          element: <Dashboard />,
          //   loader: teamLoader,
        },
      ],
    },
    {
      path: "/login",
      element: <Login />, // No layout here
    },
  ]);

  return <RouterProvider router={router} />;
};

export default RoutesComponent;
