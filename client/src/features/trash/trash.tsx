import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import clsx from "clsx";
import { Task, taskApi } from "../../slices/task/taskSlices";
import { BGS, PRIORITY_STYLES, formatDate } from "../../misc";
import Button from "../../components/Button";
import UserInfo from "../tasks/components/sharedComponents/userInfo";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import useDidMountEffect from "../../misc/useDidMountEffect";

export interface TrashedTableProps {
  tasks: Task[];
  handleRestoreTask: (taskId: string) => void;
  handlePermanentDeleteTask: (taskId: string) => void;
}

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const TrashedTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const currentProject = useSelector(
    (state: RootState) => state.navbarReducer.currentProject
  );

  const tasksListReducer = useSelector(
    (state: RootState) => state.taskReducer?.list
  );

  const deleteTaskReducer = useSelector(
    (state: RootState) => state.taskReducer.deleteTask
  );

  const restoreTaskReducer = useSelector(
    (state: RootState) => state.taskReducer.restoreTask
  );

  const searchTextReducer = useSelector(
    (state: RootState) => state.navbarReducer.searchText
  );

  useDidMountEffect(() => {
    if (currentProject.projectId) {
      dispatch(
        taskApi.list({
          status: "",
          isTrashed: true,
          projectId: currentProject.projectId,
        })
      );
    }
  }, [currentProject.projectId]);

  useEffect(() => {
    if (tasksListReducer.status === "success") {
      setTasks(tasksListReducer.data.taskData);
    }
  }, [tasksListReducer.status]);

  useDidMountEffect(() => {
    if (
      deleteTaskReducer.status === "success" ||
      restoreTaskReducer.status === "success"
    ) {
      dispatch(
        taskApi.list({
          status: "",
          isTrashed: true,
          projectId: currentProject.projectId,
        })
      );
    }
  }, [deleteTaskReducer.status, restoreTaskReducer.status]);

  useDidMountEffect(() => {
    if (currentProject.projectId) {
      dispatch(
        taskApi.list({
          projectId: currentProject.projectId,
          status: "",
          isTrashed: false,
          searchText: searchTextReducer,
        })
      );
    }
  }, [searchTextReducer]);

  const restoreTask = async (taskId: string) => {
    dispatch(taskApi.restoreTask({ taskId }));
  };

  const deleteTaskPermanently = async (taskId: string) => {
    dispatch(taskApi.deleteTask({ taskId }));
  };

  const TableRow = ({ task }: { task: Task }) => (
    <tr className="border-b border-gray-200 hover:bg-gray-100">
      <td className="py-3 px-3">
        <p className="line-clamp-2 text-gray-800">{task.title}</p>
      </td>
      <td className="py-3 px-3">
        <div
          className={`flex items-center gap-2 ${
            PRIORITY_STYLES[task.priority]
          }`}
        >
          <span className="text-lg">{ICONS[task.priority]}</span>
          <span className="font-semibold text-sm capitalize">
            {task.priority}
          </span>
        </div>
      </td>
      <td className="py-3 px-3">
        <span className="text-sm text-gray-600">
          {formatDate(new Date(task.createdAt))}
        </span>
      </td>
      <td className="py-3 px-3">
        <div className="flex -space-x-2">
          {task.teamDetails?.map((m, index) => (
            <div
              key={m.userId}
              className={clsx(
                "w-8 h-8 rounded-full text-white flex items-center justify-center text-sm",
                BGS[index % BGS.length]
              )}
              title={m.name}
            >
              <UserInfo user={m} />
            </div>
          ))}
        </div>
      </td>
      <td className="py-3 px-3 text-right">
        <Button
          className="text-green-600 hover:text-green-500 text-sm"
          label="Restore"
          type="button"
          onClick={() => restoreTask(task.taskId)}
        />
        <Button
          className="text-red-700 hover:text-red-500 text-sm ml-3"
          label="Delete"
          type="button"
          onClick={() => deleteTaskPermanently(task.taskId)}
        />
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="w-full border-b border-gray-300 bg-gray-50">
            <tr className="text-left text-gray-700">
              <th className="py-2 px-3">Task Title</th>
              <th className="py-2 px-3">Priority</th>
              <th className="py-2 px-3">Created At</th>
              <th className="py-2 px-3">Team</th>
              <th className="py-2 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasksListReducer?.status === "pending" ? (
              <tr>
                <td
                  colSpan={5}
                  className="py-4 text-center text-gray-500 text-sm"
                >
                  Loading tasks...
                </td>
              </tr>
            ) : tasks?.length ? (
              tasks.map((task) => <TableRow key={task.taskId} task={task} />)
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="py-4 text-center text-gray-500 text-sm"
                >
                  No trashed tasks found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TrashedTasks;
