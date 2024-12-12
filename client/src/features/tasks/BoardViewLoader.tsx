import clsx from "clsx";

const TaskCardLoader = () => {
  const categories: any = {
    "To Do": 3,
    "In Progress": 3,
    Completed: 3,
    "QA Testing": 3,
    "PM Testing": 3,
  };

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
      {Object.keys(categories).map((category) => (
        <div key={category} className="flex flex-col gap-4">
          {Array.from({ length: categories[category] }).map((_, idx) => (
            <div
              key={idx}
              className="w-full bg-white shadow-md p-4 rounded-lg animate-pulse"
            >
              {/* Priority Section */}
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-8 bg-gray-300 rounded" />
                  <div className="h-4 w-16 bg-gray-300 rounded" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 bg-gray-300 rounded" />
                  <div className="h-5 w-5 bg-gray-300 rounded" />
                </div>
              </div>

              {/* Title Section */}
              <div className="mb-2">
                <div className="flex items-center gap-2">
                  <div className={clsx("w-4 h-4 rounded-full bg-gray-300")} />
                  <div className="h-5 w-3/4 bg-gray-300 rounded" />
                </div>
                <div className="h-3 w-1/2 bg-gray-300 rounded mt-2" />
              </div>

              {/* Separator */}
              <div className="border-t border-gray-200 my-3"></div>

              {/* Subtasks Section */}
              <div className="h-4 w-32 bg-gray-300 rounded mb-2" />
              <div className="space-y-2">
                {Array.from({ length: 2 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-6 w-full bg-gray-200 rounded"
                  ></div>
                ))}
              </div>

              {/* Add Subtask Button */}
              <div className="mt-4 h-10 w-full bg-gray-300 rounded" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default TaskCardLoader;
