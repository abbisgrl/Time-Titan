import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  MdDashboard,
  MdOutlinePendingActions,
  MdTaskAlt,
} from "react-icons/md";
import { FaTasks, FaTrashAlt, FaUsers } from "react-icons/fa";
import { AiOutlineArrowRight, AiOutlineArrowLeft } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { isSideMenuCollapsed } from "../slices/layout/navbar";
import useDidMountEffect from "../misc/useDidMountEffect";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { isAdmin, isOwner } = useSelector(
    (state: RootState) => state.userDetails?.data
  );

  const linkData = [
    {
      label: "Dashboard",
      link: "/dashboard",
      icon: <MdDashboard />,
    },
    {
      label: "Tasks",
      link: "/tasks",
      icon: <FaTasks />,
    },
    {
      label: "Completed",
      link: "/tasks/completed",
      icon: <MdTaskAlt />,
    },
    {
      label: "In Progress",
      link: "/tasks/in-progress",
      icon: <MdOutlinePendingActions />,
    },
    {
      label: "To Do",
      link: "/tasks/todo",
      icon: <MdOutlinePendingActions />,
    },
    ...(isAdmin || isOwner
      ? [
          {
            label: "Team",
            link: "/teams",
            icon: <FaUsers />,
          },
        ]
      : []),
    {
      label: "Trash",
      link: "/trashed",
      icon: <FaTrashAlt />,
    },
  ];

  // Set initial collapse state for small screens
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    setIsCollapsed(mediaQuery.matches);

    const handleResize = () => setIsCollapsed(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleResize);
    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  useDidMountEffect(() => {
    dispatch(isSideMenuCollapsed(isCollapsed));
  }, [isCollapsed]);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <div className="min-h-screen flex flex-row bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          isCollapsed ? "w-16" : "w-56"
        } flex flex-col bg-white shadow-lg transition-all duration-300 relative`}
      >
        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="absolute -right-4 top-6 bg-gray-300 hover:bg-gray-400 p-2 rounded-full shadow-md transition"
        >
          {isCollapsed ? (
            <AiOutlineArrowRight className="text-gray-700" size={20} />
          ) : (
            <AiOutlineArrowLeft className="text-gray-700" size={20} />
          )}
        </button>

        {/* Sidebar Links */}
        <ul className="flex flex-col py-4">
          {linkData.map((item, index) => (
            <li key={index}>
              <Link
                to={item.link} // Replace `href` with `to`
                className="flex items-center h-12 px-3 hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition"
              >
                <span className="text-xl">{item.icon}</span>
                {!isCollapsed && (
                  <span className="ml-3 text-sm font-medium">{item.label}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
