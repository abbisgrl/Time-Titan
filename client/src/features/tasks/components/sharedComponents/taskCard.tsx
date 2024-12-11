import clsx from "clsx";
import { useState } from "react";
import {
  MdAttachFile,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { BGS, PRIORITY_STYLES, TASK_TYPE, formatDate } from "../../../../misc";
import { BiMessageAltDetail } from "react-icons/bi";
import { FaList } from "react-icons/fa";
import UserInfo from "./userInfo";
import { IoMdAdd, IoMdSend } from "react-icons/io";
import { AppDispatch, RootState } from "../../../../store";
import { Task, taskApi } from "../../../../slices/task/taskSlices";
import CreateSubTasks from "../create/createSubTasks";
import { MdEdit, MdDelete } from "react-icons/md";
import CreateTask from "../create/createTasks";

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const TaskCard = ({ task }: { task: Task }) => {
  const { isAdmin, isOwner, userId } = useSelector(
    (state: RootState) => state.userDetails?.data
  );
  const dispatch = useDispatch<AppDispatch>();

  const [openCreateSubtask, setOpenCreateSubtask] = useState(false);
  const [openCreateTask, setOpenCreateTask] = useState(false);
  const [taskId, setTaskId] = useState("");
  const [subTasksOpen, setSubTasksOpen] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [newComment, setNewComment] = useState("");

  const handleEditTask = () => {
    setTaskId(task.taskId);
    setOpenCreateTask(true);
  };

  const handleDeleteTask = () => {
    dispatch(taskApi.deleteTask({ taskId: task.taskId }));
  };

  const handleAddComment = () => {
    const comment = {
      comment: newComment,
      taskId: task.taskId,
      userId,
    };
    dispatch(taskApi.addComment(comment));
    setNewComment("");
  };

  return (
    <div className="w-full bg-white shadow-md p-4 rounded-lg">
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
        <div className="flex items-center gap-2">
          <button
            onClick={handleEditTask}
            className="text-blue-600 hover:text-blue-800"
          >
            <MdEdit size={20} />
          </button>
          <button
            onClick={handleDeleteTask}
            className="text-red-600 hover:text-red-800"
          >
            <MdDelete size={20} />
          </button>
        </div>
      </div>
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
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-4 text-gray-600">
          <div className="flex items-center gap-1 text-sm">
            <BiMessageAltDetail />
            <span>{task?.comments?.length}</span>
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

      {/* Subtasks Section */}
      <div>
        <button
          onClick={() => setSubTasksOpen(!subTasksOpen)}
          className="text-blue-600 text-sm"
        >
          {subTasksOpen ? "Hide Subtasks" : "View Subtasks"}
        </button>
        {subTasksOpen && (
          <div className="mt-2 max-h-32 overflow-y-auto space-y-2">
            {task?.subTasks?.length > 0 ? (
              task?.subTasks?.map((subTask, index) => (
                <div
                  key={index}
                  className="p-2 bg-gray-100 rounded border border-gray-200"
                >
                  <h5 className="font-medium text-sm">{subTask?.title}</h5>
                  <div className="text-gray-600 text-xs">
                    <span>{formatDate(new Date(subTask?.createdAt))}</span>
                    <span className="ml-2 bg-blue-100 text-blue-700 px-2 py-1 rounded-lg">
                      {subTask?.tag}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No Subtasks</p>
            )}
          </div>
        )}
      </div>

      {/* Comments Section */}
      <div className="mt-4">
        <button
          onClick={() => setCommentsOpen(!commentsOpen)}
          className="text-blue-600 text-sm"
        >
          {commentsOpen ? "Hide Comments" : "View Comments"}
        </button>
        {commentsOpen && (
          <div className="mt-2 space-y-2">
            {task?.comments?.length > 0 ? (
              task?.comments?.map((item, index) => (
                <div
                  key={index}
                  className="p-2 bg-gray-100 rounded border border-gray-200"
                >
                  <p className="text-sm text-gray-800">{item?.comment}</p>
                  <div className="text-xs text-gray-600">
                    {formatDate(new Date(item?.createdAt))}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No Comments</p>
            )}
            <div className="flex items-center gap-2 mt-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment"
                className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
              />
              <button
                onClick={handleAddComment}
                className="text-blue-600 hover:text-blue-800"
              >
                <IoMdSend size={20} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Subtask Button */}
      <button
        onClick={() => setOpenCreateSubtask(true)}
        disabled={!(isAdmin || isOwner)}
        className="w-full flex items-center justify-center gap-2 text-blue-600 font-medium hover:bg-blue-50 py-2 rounded-lg disabled:opacity-50"
      >
        <IoMdAdd />
        Add Subtask
      </button>

      {/* Modals */}
      <CreateSubTasks
        open={openCreateSubtask}
        setOpen={setOpenCreateSubtask}
        taskId={task.taskId}
      />
      <CreateTask
        open={openCreateTask}
        setOpen={setOpenCreateTask}
        taskId={taskId}
        setTaskId={setTaskId}
      />
    </div>
  );
};

export default TaskCard;
