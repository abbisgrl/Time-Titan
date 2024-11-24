import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { User, teamListApi } from "../../slices/teamListSlice";
import { AppDispatch, RootState } from "../../store";
import Title from "../../components/title";

const TeamListing = () => {
  const dispatch = useDispatch<AppDispatch>();
  const teamList = useSelector((state: RootState) => state.teamList?.data);

  useEffect(() => {
    dispatch(teamListApi());
  }, []);

  console.log("TeamListing", teamList);

  const handleEdit = (id: string) => {
    console.log("Edit user with ID:", id);
  };

  const handleDelete = (id: string) => {
    console.log("Delete user with ID:", id);
  };

  return (
    <div className="container mx-auto p-4 max-w-screen-lg">
      <Title title="Team Members" className="mb-8" />
      {/* Desktop View */}
      <div className="hidden md:block">
        <div className="grid grid-cols-12 bg-gray-100 rounded-t-lg shadow-md font-semibold text-sm text-gray-600 sticky top-[-16px] z-10">
          <div className="col-span-3 px-4 py-3">Full Name</div>
          <div className="col-span-3 px-4 py-3">Email</div>
          <div className="col-span-2 px-4 py-3">Role</div>
          <div className="col-span-2 px-4 py-3">Active</div>
          <div className="col-span-2 px-4 py-3 text-center">Actions</div>
        </div>
        {teamList.map((user: User) => (
          <div
            key={user.userId}
            className="grid grid-cols-12 items-center bg-white rounded-lg shadow-md mt-2"
          >
            <div className="col-span-3 px-4 py-3 text-gray-800">
              {user.name}
            </div>
            <div className="col-span-3 px-4 py-3 text-gray-800">
              {user.email}
            </div>
            <div className="col-span-2 px-4 py-3 text-gray-800">
              {user.role}
            </div>
            <div className="col-span-2 px-4 py-3 text-gray-800">
              {user.isActive ? (
                <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-200 rounded">
                  Yes
                </span>
              ) : (
                <span className="px-2 py-1 text-xs font-semibold text-red-800 bg-red-200 rounded">
                  No
                </span>
              )}
            </div>
            <div className="col-span-2 px-4 py-3 text-center">
              <button
                className="px-3 py-1 mr-2 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
                onClick={() => handleEdit(user.userId)}
              >
                Edit
              </button>
              <button
                className="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600"
                onClick={() => handleDelete(user.userId)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile View */}
      <div className="block md:hidden">
        {teamList.map((user: User) => (
          <div
            key={user.userId}
            className="mb-4 bg-white shadow rounded-lg p-4"
          >
            <div className="text-sm font-medium text-gray-800">
              <span className="font-semibold">Full Name: </span> {user.name}
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-semibold">Email: </span> {user.email}
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-semibold">Role: </span> {user.role}
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-semibold">Active: </span>
              {user.isActive ? (
                <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-200 rounded">
                  Yes
                </span>
              ) : (
                <span className="px-2 py-1 text-xs font-semibold text-red-800 bg-red-200 rounded">
                  No
                </span>
              )}
            </div>
            <div className="mt-4">
              <button
                className="px-3 py-1 mr-2 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
                onClick={() => handleEdit(user.userId)}
              >
                Edit
              </button>
              <button
                className="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600"
                onClick={() => handleDelete(user.userId)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamListing;
