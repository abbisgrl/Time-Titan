const NoProjectsFound = ({
  buttonLabel,
  onButtonClick,
}: {
  buttonLabel: string;
  onButtonClick: (openAddProject: boolean) => void;
}) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-center bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold text-gray-700">No Projects Found</h2>
      <p className="text-gray-500 mt-2">
        It looks like you haven't created any projects yet.
      </p>
      <div className="mt-6">
        <button
          onClick={() => onButtonClick(true)}
          className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-300"
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
};

export default NoProjectsFound;
