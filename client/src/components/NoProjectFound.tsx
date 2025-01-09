import { useSelector } from "react-redux";
import { RootState } from "../store";

const NoProjectsFound = ({
  buttonLabel,
  onButtonClick,
}: {
  buttonLabel: string;
  onButtonClick: (openAddProject: boolean) => void;
}) => {
  const { isAdmin, isOwner } = useSelector(
    (state: RootState) => state.userDetails?.data
  );
  const isAdminOrOwner = isAdmin || isOwner;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-center bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold text-gray-700">No Projects Found</h2>
      {isAdminOrOwner ? (
        <>
          <p className="text-gray-500 mt-2">
            It looks like you haven't access to any projects yet.
          </p>
          <div className="mt-6">
            <button
              onClick={() => onButtonClick(true)}
              className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-300"
            >
              {buttonLabel}
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="text-gray-500 mt-2">
            You don't have permission to create projects. Please contact your
            admin or project owner for project access.
          </p>
          <div className="mt-6">
            <button
              onClick={() => {}}
              className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-md hover:bg-gray-600 transition duration-300"
            >
              Contact Admin
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default NoProjectsFound;
