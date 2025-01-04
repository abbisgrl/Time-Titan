import clsx from "clsx";
import { useState } from "react";
import {
  MdAttachFile,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
  MdArrowForward,
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
  normal: <MdArrowForward />,
};

const TaskCard = ({
  task,
  handleDeleteTask,
}: {
  task: Task;
  handleDeleteTask: (taskId: string) => void;
}) => {
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
    <div className="w-full max-w-[220px] bg-white shadow-sm p-2 rounded-lg">
      <div className="flex justify-between items-center mb-1">
        <div
          className={clsx(
            "flex items-center gap-1",
            PRIORITY_STYLES[task?.priority]
          )}
        >
          {ICONS[task?.priority]}
          <span className="font-semibold text-xs capitalize">
            {task?.priority} Priority
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleEditTask}
            className="text-blue-600 hover:text-blue-800 text-xs"
          >
            <MdEdit size={16} />
          </button>
          <button
            onClick={() => {
              handleDeleteTask(task.taskId);
            }}
            className="text-red-600 hover:text-red-800 text-xs"
          >
            <MdDelete size={16} />
          </button>
        </div>
      </div>

      <div className="mb-1">
        <div className="flex items-center gap-1">
          <div
            className={clsx("w-2.5 h-2.5 rounded-full", TASK_TYPE[task?.stage])}
          />
          <h4
            className="font-medium text-xs text-gray-800 w-full truncate"
            title={task?.title}
          >
            {task?.title}
          </h4>
        </div>
        <span className="text-xs text-gray-600">
          {formatDate(new Date(task?.createdAt))}
        </span>
      </div>

      <div className="border-t border-gray-200 my-1"></div>

      <div className="flex justify-between items-center mb-1 text-xs text-gray-600">
        <div className="flex gap-2">
          <div className="flex items-center gap-0.5">
            <BiMessageAltDetail size={14} />
            <span>{task?.comments?.length}</span>
          </div>
          <div className="flex items-center gap-0.5">
            <MdAttachFile size={14} />
            <span>{task?.assets?.length}</span>
          </div>
          <div className="flex items-center gap-0.5">
            <FaList size={14} />
            <span>{task?.subTasks?.length}</span>
          </div>
        </div>
        <div className="flex gap-1">
          {task?.teamDetails?.map((m, index) => (
            <div
              key={index}
              className={clsx(
                "w-5 h-5 rounded-full text-white flex items-center justify-center text-xs -ml-1",
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
          className="text-blue-600 text-xs"
        >
          {subTasksOpen ? "Hide Subtasks" : "View Subtasks"}
        </button>
        {subTasksOpen && (
          <div className="mt-1 max-h-16 overflow-y-auto space-y-1">
            {task?.subTasks?.length > 0 ? (
              task?.subTasks?.map((subTask, index) => (
                <div
                  key={index}
                  className="p-1 bg-gray-100 rounded border border-gray-200"
                >
                  <h5 className="font-medium text-xs">{subTask?.title}</h5>
                  <div className="text-xs text-gray-600">
                    <span>{formatDate(new Date(subTask?.createdAt))}</span>
                    <span className="ml-1 bg-blue-100 text-blue-700 px-1 py-0.5 rounded-lg">
                      {subTask?.tag}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-500">No Subtasks</p>
            )}
          </div>
        )}
      </div>

      {/* Comments Section */}
      <div className="mt-1">
        <button
          onClick={() => setCommentsOpen(!commentsOpen)}
          className="text-blue-600 text-xs"
        >
          {commentsOpen ? "Hide Comments" : "View Comments"}
        </button>
        {commentsOpen && (
          <div className="mt-1 space-y-1">
            {task?.comments?.length > 0 ? (
              task?.comments?.map((item, index) => (
                <div
                  key={index}
                  className="p-1 bg-gray-100 rounded border border-gray-200"
                >
                  <p className="text-xs text-gray-800">{item?.comment}</p>
                  <div className="text-xs text-gray-600">
                    {formatDate(new Date(item?.createdAt))}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-500">No Comments</p>
            )}
            <div className="flex items-center gap-1 mt-1">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment"
                className="flex-1 border border-gray-300 rounded px-1 py-0.5 text-xs"
              />
              <button
                onClick={handleAddComment}
                className="text-blue-600 hover:text-blue-800"
              >
                <IoMdSend size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Subtask Button */}
      <button
        onClick={() => setOpenCreateSubtask(true)}
        disabled={!(isAdmin || isOwner)}
        className="w-full flex items-center justify-center gap-1 text-blue-600 font-medium hover:bg-blue-50 py-1 rounded-lg disabled:opacity-50 text-xs"
      >
        <IoMdAdd size={16} />
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
