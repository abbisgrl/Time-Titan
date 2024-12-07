import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LayoutComponent from "../layout/index.tsx";
import Dashboard from "../features/dashboard/index.tsx";
import Login from "../features/auth/login.tsx";
import TeamListing from "../features/team/team.tsx";
import Tasks from "../features/tasks/tasks.tsx";

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
        { path: "/tasks", element: <Tasks /> },
        {
          path: "/teams",
          element: <TeamListing />,
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
