import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LayoutComponent from "../layout/index.tsx";
import Dashboard from "../features/dashboard/index.tsx";
import Login from "../features/auth/login.tsx";
import TeamListing from "../features/team/team.tsx";
import Tasks from "../features/tasks/tasks.tsx";
import TrashedTasks from "../features/trash/trash.tsx";
import CreatePassword from "../features/auth/createPassword.tsx";

const RoutesComponent = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <LayoutComponent />,
      children: [
        {
          path: "/dashboard",
          element: <Dashboard />,
        },
        { path: "/tasks", element: <Tasks /> },
        { path: "/tasks/:status", element: <Tasks /> },
        {
          path: "/teams",
          element: <TeamListing />,
        },
        {
          path: "/trashed",
          element: <TrashedTasks />,
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/create/password",
      element: <CreatePassword />,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default RoutesComponent;
