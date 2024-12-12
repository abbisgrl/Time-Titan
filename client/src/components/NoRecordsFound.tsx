const NoRecordsFound = ({
  buttonLabel,
  onButtonClick,
}: {
  buttonLabel: string;
  onButtonClick: (openAddTask: boolean) => void;
}) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-center bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold text-gray-600">No Records Found</h2>
      <div className="mt-4">
        <button
          onClick={() => onButtonClick(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
};

export default NoRecordsFound;
