import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { User, teamApi } from "../../slices/team/teamSlices";
import { AppDispatch, RootState } from "../../store";
import Title from "../../components/title";
import AddTeamMember from "./addTeamMember";
import { roleMap } from "../../misc";

const TeamListing = () => {
  const [openAddModal, setIsOpenAddModal] = useState(false);
  const [teamEditId, setTeamEditId] = useState("");

  const dispatch = useDispatch<AppDispatch>();
  const teamList = useSelector(
    (state: RootState) => state.teamReducer.list?.data
  );
  const projectData = useSelector(
    (state: RootState) => state.projectReducer.list
  );

  const ProjectList = useCallback(() => {
    return projectData?.data?.map((project) => ({
      value: project.projectId,
      label: project.name,
    }));
  }, [projectData]);

  useEffect(() => {
    dispatch(teamApi.list());
  }, []);

  useEffect(() => {
    if (teamEditId) {
      setIsOpenAddModal(true);
    }
  }, [teamEditId]);

  useEffect(() => {
    if (!openAddModal) {
      setTeamEditId("");
    }
  }, [openAddModal]);

  const handleEdit = (id: any) => {
    setTeamEditId(id);
  };

  const handleDelete = (id: any) => {
    console.log({ id });
    dispatch(teamApi.delete(id));
  };

  return (
    <div className="container mx-auto p-4 max-w-screen-lg">
      <div className="flex items-center justify-between mb-8">
        <Title title="Team Members" className="" />
        <button
          className="px-4 py-2 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
          onClick={() => setIsOpenAddModal(true)} // Add your handler function here
        >
          Add Member
        </button>
      </div>

      {teamList?.length ? (
        <>
          {" "}
          {/* Desktop View */}
          <div className="hidden md:block">
            <div className="grid grid-cols-12 bg-gray-100 rounded-t-lg shadow-md font-semibold text-sm text-gray-600 sticky top-[-16px] z-10">
              <div className="col-span-2 px-4 py-3">Full Name</div>
              <div className="col-span-3 px-4 py-3">Email</div>
              <div className="col-span-2 px-4 py-3">Password</div>
              <div className="col-span-1 px-4 py-3">Role</div>
              <div className="col-span-1 px-4 py-3">Active</div>
              <div className="col-span-1 px-4 py-3">Projects</div>
              <div className="col-span-1 px-4 py-3 text-center">Actions</div>
            </div>
            {teamList.map((user: User) => {
              if (!user.userId) return null;
              const roleLabel = user.role
                ? roleMap[user.role as keyof typeof roleMap]
                : "Admin";
              return (
                <div
                  key={user.userId}
                  className="grid grid-cols-12 items-center bg-white rounded-lg shadow-md mt-2"
                >
                  <div className="col-span-2 px-4 py-3 text-gray-800">
                    {user.name}
                  </div>
                  <div className="col-span-3 px-4 py-3 text-gray-800">
                    {user.email}
                  </div>
                  <div className="col-span-2 px-4 py-3 text-gray-800">
                    {user.memberPassword}
                  </div>
                  <div className="col-span-1 px-4 py-3 text-gray-800">
                    {roleLabel}
                  </div>
                  <div className="col-span-1 px-4 py-3 text-gray-800">
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
                  <div className="col-span-1 px-4 py-3 text-gray-800">
                    <div className="relative group">
                      <div className="hidden group-hover:block absolute bg-gray-100 p-2 rounded shadow-md w-48 mt-6">
                        <ul className="text-sm">
                          {user.projects?.map(
                            (projectId: string, index: number) => {
                              // Find the project by its ID from createProjectData
                              const project = ProjectList().find(
                                (p) => p.value === projectId
                              );
                              return project ? (
                                <li key={index} className="text-gray-700">
                                  {project.label}
                                </li>
                              ) : null;
                            }
                          )}
                        </ul>
                      </div>
                      <div className="relative cursor-pointer text-blue-500 underline">
                        Projects
                      </div>
                    </div>
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
              );
            })}
          </div>
          {/* Mobile View */}
          <div className="block md:hidden">
            {teamList.map((user: User) => {
              if (!user.userId) return null;
              const roleLabel = user.role
                ? roleMap[user.role as keyof typeof roleMap]
                : "Admin";
              return (
                <div
                  key={user.userId}
                  className="mb-4 bg-white shadow rounded-lg p-4"
                >
                  <div className="text-sm font-medium text-gray-800">
                    <span className="font-semibold">Full Name: </span>
                    {user.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-semibold">Email: </span> {user.email}
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-semibold">Password: </span>
                    {user.memberPassword}
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-semibold">Role: </span>
                    {roleLabel}
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
              );
            })}
          </div>
        </>
      ) : (
        <h1>No Record Founds</h1>
      )}

      {/* Add team modal */}
      <AddTeamMember
        open={openAddModal}
        setOpen={setIsOpenAddModal}
        teamId={teamEditId}
      />
    </div>
  );
};

export default TeamListing;
