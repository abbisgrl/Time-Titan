import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { dashboardApi } from "../../slices/dashboard/dashboardSlice";
import { taskApi } from "../../slices/task/taskSlices";
import { FaEdit } from "react-icons/fa";
import CreateTask from "../tasks/components/create/createTasks";
import useDidMountEffect from "../../misc/useDidMountEffect";
import { DashboardResponse, DashboardTask } from "./dashboardTypes";

const statuses = [
  "To Do",
  "In Progress",
  "Ready to QA",
  "Ready to PM",
  "Completed",
];

const mapToGetStatus: { [key: string]: string } = {
  "To Do": "todo",
  "In Progress": "in-progress",
  "Ready to QA": "qa-testing",
  "Ready to PM": "pm-testing",
  Completed: "completed",
};

const mapToGetStatusReverse: { [key: string]: string } = {
  todo: "To Do",
  "in-progress": "In Progress",
  "qa-testing": "Ready to QA",
  "pm-testing": "Ready to PM",
  completed: "Completed",
};

const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const currentProject = useSelector(
    (state: RootState) => state.navbarReducer.currentProject
  ) as { projectId: string; [key: string]: string };

  const getCardDetails = useSelector(
    (state: RootState) => state.dashboardReducer.getCardDetails
  ) as unknown as DashboardResponse;

  const getTaskList = useSelector(
    (state: RootState) => state.dashboardReducer.taskList
  ) as unknown as { status: string; data: { taskList: DashboardTask[] } };

  const [tasks, setTasks] = useState<DashboardTask[]>([]);
  const [openTaskDetails, setOpenTaskDetails] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState("");

  useEffect(() => {
    if (!openTaskDetails) {
      setCurrentTaskId("");
    }
  }, [openTaskDetails]);

  useDidMountEffect(() => {
    if (currentProject.projectId) {
      dispatch(dashboardApi.getDashboardCardDetails(currentProject.projectId));
      dispatch(dashboardApi.getDashboardTasksList(currentProject.projectId));
    }
  }, [JSON.stringify(currentProject)]);

  useDidMountEffect(() => {
    if (getTaskList.status === "success") {
      setTasks(getTaskList?.data?.taskList);
    }
  }, [getTaskList]);

  const handleStatusChange = (taskId: string, newStatus: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task: DashboardTask) => {
        if (task.taskId === taskId) {
          const updatedTaskData = {
            ...task,
            stage: mapToGetStatus[newStatus],
            team: task.team,
          };
          dispatch(taskApi.updateTask(updatedTaskData));
          return updatedTaskData;
        }
        return task;
      })
    );
  };

  let statusCounts: { [key: string]: number } = {};
  if (getCardDetails.data.cardDetails) {
    statusCounts = statuses.reduce(
      (acc: { [key: string]: number }, status: string) => {
        acc[status] = getCardDetails.data.cardDetails[mapToGetStatus[status]];
        return acc;
      },
      {}
    );
  }

  return (
    <div className="p-6 bg-gradient-to-b from-blue-100 via-white to-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-700">
        Task Management Dashboard
      </h1>

      {getCardDetails?.status !== "success" ? (
        <div className="flex justify-center items-center mb-6">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-8 w-8"></div>
          <span className="ml-2 text-gray-500">Loading...</span>
        </div>
      ) : (
        <>
          {/* Status Counters */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            {statuses.map((status) => (
              <div
                key={status}
                className="bg-white shadow-lg p-4 rounded-lg text-center hover:shadow-xl transition-shadow"
              >
                <h2 className="text-lg font-semibold text-gray-700">
                  {status}
                </h2>
                <p className="text-3xl font-bold text-blue-500">
                  {statusCounts[status] || 0}
                </p>
              </div>
            ))}
          </div>

          {/* Task List */}
          <div className="bg-white shadow-lg p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Tasks</h2>
            {tasks.length === 0 ? (
              <div className="text-center text-gray-500 font-medium">
                No recent tasks
              </div>
            ) : (
              <ul>
                {tasks.map((task: DashboardTask) => (
                  <li
                    key={task.taskId}
                    className="grid grid-cols-1 md:grid-cols-6 items-center py-4 border-b hover:bg-gray-50 transition"
                  >
                    <div className="col-span-3 text-gray-700 font-medium">
                      {task.title}
                    </div>
                    <div className="col-span-1 text-gray-500">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                    <div className="col-span-1">
                      <select
                        value={mapToGetStatusReverse[task.stage]}
                        onChange={(e) =>
                          handleStatusChange(task.taskId, e.target.value)
                        }
                        className="bg-gray-100 border rounded px-2 py-1 text-gray-600 w-full"
                      >
                        {statuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-1 flex items-center justify-center space-x-2">
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full text-white ${
                          task.priority === "High"
                            ? "bg-red-600"
                            : task.priority === "Medium"
                            ? "bg-yellow-400"
                            : "bg-green-600"
                        }`}
                        style={{
                          padding: "0.25rem 0.5rem",
                          fontSize: "0.75rem",
                          border: "1px solid",
                          borderColor:
                            task.priority === "High"
                              ? "#c53030"
                              : task.priority === "Medium"
                              ? "#eab308"
                              : "#16a34a",
                          marginRight: "0.5rem",
                        }}
                      >
                        {task.priority}
                      </span>
                      <FaEdit
                        className="text-gray-500 cursor-pointer hover:text-gray-700"
                        title="Edit Priority"
                        onClick={() => {
                          setCurrentTaskId(task.taskId);
                          setOpenTaskDetails(true);
                        }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <CreateTask
            open={openTaskDetails}
            setOpen={setOpenTaskDetails}
            taskId={currentTaskId}
            setTaskId={setCurrentTaskId}
          />
        </>
      )}
    </div>
  );
};

export default Dashboard;
