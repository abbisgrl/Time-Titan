import clsx from "clsx";
import { useState } from "react";
import {
  MdAttachFile,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { useSelector } from "react-redux";
import { BGS, PRIORITY_STYLES, TASK_TYPE, formatDate } from "../../../../misc";
import { BiMessageAltDetail } from "react-icons/bi";
import { FaList } from "react-icons/fa";
import UserInfo from "./userInfo";
import { IoMdAdd } from "react-icons/io";
// import AddSubTask from "./task/AddSubTask";
import { RootState } from "../../../../store";
import { Task } from "../../../../slices/task/taskSlices";
import CreateSubTasks from "../create/createSubTasks";

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const TaskCard = ({ task }: { task: Task }) => {
  const { isAdmin, isOwner } = useSelector(
    (state: RootState) => state.userDetails?.data
  );

  const [openCreateSubtask, setOpenCreateSubtask] = useState(false);

  return (
    <div className="w-full bg-white shadow-md p-4 rounded-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div
          className={clsx(
            "flex items-center gap-2",
            PRIORITY_STYLES[task?.priority]
          )}
        >
          {ICONS[task?.priority]}
          <span className="font-semibold text-sm capitalize">
            {task?.priority} Priority
          </span>
        </div>
        {/* {user?.isAdmin && <TaskDialog task={task} />} */}
      </div>

      {/* Title and Stage */}
      <div className="mb-2">
        <div className="flex items-center gap-2">
          <div
            className={clsx("w-4 h-4 rounded-full", TASK_TYPE[task?.stage])}
          />
          <h4 className="font-medium text-lg text-gray-800 truncate">
            {task?.title}
          </h4>
        </div>
        <span className="text-sm text-gray-600">
          {formatDate(new Date(task?.createdAt))}
        </span>
      </div>

      <div className="border-t border-gray-200 my-3"></div>

      {/* Info Section */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-4 text-gray-600">
          <div className="flex items-center gap-1 text-sm">
            <BiMessageAltDetail />
            <span>{task?.activities?.length}</span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <MdAttachFile />
            <span>{task?.assets?.length}</span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <FaList />
            <span>{task?.subTasks?.length}</span>
          </div>
        </div>

        <div className="flex flex-row-reverse">
          {task?.teamDetails?.map((m, index) => (
            <div
              key={index}
              className={clsx(
                "w-8 h-8 rounded-full text-white flex items-center justify-center text-sm -ml-2",
                BGS[index % BGS?.length]
              )}
            >
              <UserInfo user={m} />
            </div>
          ))}
        </div>
      </div>

      {/* Subtask Section */}
      {task?.subTasks?.length > 0 ? (
        <>
          {task?.subTasks?.map((subTask) => (
            <div className="py-4 border-t border-gray-200">
              <h5 className="text-base font-semibold text-gray-800 truncate">
                {subTask?.title}
              </h5>
              <div className="flex gap-4 text-sm text-gray-600">
                <span>{formatDate(new Date(subTask?.createdAt))}</span>
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-lg">
                  {subTask?.tag}
                </span>
              </div>
            </div>
          ))}
        </>
      ) : (
        <div className="py-4 border-t border-gray-200 text-gray-500">
          No Subtasks
        </div>
      )}

      {/* Add Subtask */}
      <button
        onClick={() => setOpenCreateSubtask(true)}
        disabled={!(isAdmin || isOwner)}
        className="w-full flex items-center justify-center gap-2 text-blue-600 font-medium hover:bg-blue-50 py-2 rounded-lg disabled:opacity-50"
      >
        <IoMdAdd />
        Add Subtask
      </button>

      <CreateSubTasks
        open={openCreateSubtask}
        setOpen={setOpenCreateSubtask}
        taskId={task.taskId}
      />
    </div>
  );
};

export default TaskCard;
