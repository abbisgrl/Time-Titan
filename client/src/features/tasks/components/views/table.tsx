import { BiMessageAltDetail } from "react-icons/bi";
import {
  MdAttachFile,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import {
  BGS,
  PRIORITY_STYLES,
  TASK_TYPE,
  formatDate,
} from "../../../../misc/index";
import clsx from "clsx";
import { FaList } from "react-icons/fa";
import Button from "../../../../components/Button";
import UserInfo from "../sharedComponents/userInfo";
import { Task, taskApi } from "../../../../slices/task/taskSlices";
import { useState } from "react";
import CreateTask from "../create/createTasks";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../store";

export interface TableProps {
  tasks: Task[];
}

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const Table = ({ tasks }: TableProps) => {
  const [openCreateTask, setOpenCreateTask] = useState(false);
  const [taskId, setTaskId] = useState("");
  const dispatch = useDispatch<AppDispatch>();

  const deleteClicks = (taskId: string) => {
    console.log("Deleting task with ID:", taskId);
    dispatch(taskApi.deleteTask({ taskId }));
  };

  const TableHeader = () => (
    <thead className="w-full border-b border-gray-300 bg-gray-50">
      <tr className="text-left text-gray-700">
        <th className="py-2 px-3">Task Title</th>
        <th className="py-2 px-3">Priority</th>
        <th className="py-2 px-3">Created At</th>
        <th className="py-2 px-3">Assets</th>
        <th className="py-2 px-3">Team</th>
        <th className="py-2 px-3 text-right">Actions</th>
      </tr>
    </thead>
  );

  const TableRow = ({ task }: { task: Task }) => (
    <tr className="border-b border-gray-200 hover:bg-gray-100">
      <td className="py-3 px-3">
        <div className="flex items-center gap-3">
          <div
            className={clsx("w-4 h-4 rounded-full", TASK_TYPE[task.stage])}
          />
          <p className="line-clamp-2 text-gray-800">{task?.title}</p>
        </div>
      </td>

      <td className="py-3 px-3">
        <div
          className={`flex items-center gap-2 ${
            PRIORITY_STYLES[task?.priority]
          }`}
        >
          <span className={"text-lg"}>{ICONS[task?.priority]}</span>
          <span className="font-semibold text-sm capitalize">
            {task?.priority} Priority
          </span>
        </div>
      </td>

      <td className="py-3 px-3">
        <span className="text-sm text-gray-600">
          {formatDate(new Date(task?.createdAt))}
        </span>
      </td>

      <td className="py-3 px-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-gray-600">
            <BiMessageAltDetail />
            <span>{task?.activities?.length}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <MdAttachFile />
            <span>{task?.assets?.length}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <FaList />
            <span>{task?.subTasks?.length}</span>
          </div>
        </div>
      </td>

      <td className="py-3 px-3">
        <div className="flex -space-x-2">
          {task?.teamDetails?.map((m, index) => (
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
          className="text-blue-600 hover:text-blue-500 text-sm"
          label="Edit"
          type="button"
          onClick={() => {
            setTaskId(task?.taskId);
            setOpenCreateTask(true);
          }}
        />
        <Button
          className="text-red-700 hover:text-red-500 text-sm ml-3"
          label="Delete"
          type="button"
          onClick={() => deleteClicks(task.taskId)}
        />
      </td>
    </tr>
  );

  return (
    <>
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <TableHeader />
            <tbody>
              {tasks.length ? (
                tasks.map((task) => <TableRow key={task.taskId} task={task} />)
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="py-4 text-center text-gray-500 text-sm"
                  >
                    No tasks available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <CreateTask
        open={openCreateTask}
        setOpen={setOpenCreateTask}
        taskId={taskId}
        setTaskId={setTaskId}
      />
    </>
  );
};

export default Table;
