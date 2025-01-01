import React, { useCallback, useEffect, useState } from "react";
import FormInput from "../../../../components/FormInput";
import ModalWrapper from "../../../../components/ModalWrapper";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store";
import { teamApi } from "../../../../slices/team/teamSlices";
import { Task, taskApi } from "../../../../slices/task/taskSlices";
import { formatDate } from "../../../../misc";
import CreateSubTasks from "./createSubTasks";
import { FaTrashAlt, FaEdit, FaPlusCircle } from "react-icons/fa";

type teamOption = {
  label?: string;
  value?: string;
};

type SubTask = {
  createdAt: string;
  description: string;
  dueDate: string;
  subTaskId: string;
  tag: string;
  taskId: string;
  title: string;
  updatedAt: string;
  status: string;
  __v: number;
  _id: string;
};

type TaskComment = {
  commentId: string;
  createdAt: string;
  taskId: string;
  updatedAt: string;
  userId: string;
  userName: string;
  __v: number;
  _id: string;
  comment: string;
};

const CreateTask = ({
  open,
  setOpen,
  currentProject,
  taskId,
  setTaskId,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  currentProject?: { projectId: "" };
  taskId?: string;
  setTaskId?: (taskId: string) => void;
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const projectTeamList = useSelector(
    (state: RootState) => state.teamReducer.projectsTeamList
  );
  const viewTask = useSelector(
    (state: RootState) => state.taskReducer.viewTask
  );
  const { userId } = useSelector((state: RootState) => state.userDetails?.data);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "normal",
    stage: "todo",
    team: {},
    dueDate: new Date(),
  });

  const [comments, setComments] = useState<TaskComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [subTasks, setSubTasks] = useState<SubTask[]>([]);
  const [openCreateSubtask, setOpenCreateSubtask] = useState(false);
  const [subTaskId, setSubTaskId] = useState("");

  useEffect(() => {
    if (!taskId) {
      setFormData({
        title: "",
        description: "",
        priority: "normal",
        stage: "todo",
        team: {},
        dueDate: new Date(),
      });
    }
  }, [open]);

  useEffect(() => {
    if (currentProject?.projectId) {
      dispatch(teamApi.projectTeamList(currentProject.projectId));
    }
  }, [currentProject]);

  useEffect(() => {
    if (taskId) {
      dispatch(taskApi.viewTask({ taskId }));
    }
  }, [taskId]);

  useEffect(() => {
    if (viewTask?.status === "success") {
      const { taskDetails } = viewTask?.data;
      const {
        title,
        description,
        priority,
        stage,
        dueDate,
        team,
        comments: taskComments,
        subTasks: subtasks,
      } = taskDetails as Task & {
        team: any[];
        comments: TaskComment[];
        subtasks: SubTask[];
      };
      const memberInfo = projectTeamList?.data?.filter(
        (t) => t.userId === team[0]
      );

      setFormData({
        title,
        description,
        priority,
        stage,
        dueDate: new Date(dueDate),
        team: { label: memberInfo[0]?.name, value: memberInfo[0]?.userId },
      });
      setComments(taskComments || []);
      setSubTasks(subtasks || []);
    }
  }, [viewTask.status]);

  useEffect(() => {
    if (!openCreateSubtask) {
      setSubTaskId("");
    }
  }, [openCreateSubtask]);

  const projectTeamListFunction = useCallback((): teamOption[] => {
    return (
      projectTeamList?.data?.map((team) => ({
        value: team.userId,
        label: team.name,
      })) || []
    );
  }, [projectTeamList]);

  const handleChange = (name: string, value: any) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleTeamChange = (selectedOptions: any) => {
    handleChange("team", selectedOptions);
  };

  const handleCommentSubmit = () => {
    const comment = {
      comment: newComment,
      taskId: taskId || "",
      userId,
    };
    dispatch(taskApi.addComment(comment));
    dispatch(taskApi.viewTask({ taskId: taskId || "" }));
    setNewComment("");
  };

  const handleSubTaskStatusChange = (id: string, newStatus: string) => {
    setSubTasks((prev) =>
      prev.map((subTask: SubTask) => {
        if (subTask.subTaskId === id) {
          const subTaskUpdated = { ...subTask, status: newStatus };
          dispatch(taskApi.subTaskUpdate(subTaskUpdated));
          return subTaskUpdated;
        }
        return subTask;
      })
    );
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const taskData = {
      ...formData,
      projectId: currentProject?.projectId,
      comments,
      subtasks: subTasks,
    };
    if (taskId) {
      dispatch(taskApi.updateTask({ ...taskData, taskId }));
    } else {
      dispatch(taskApi.create(taskData));
    }
    setOpen(false);
    setFormData({
      title: "",
      description: "",
      priority: "normal",
      stage: "todo",
      team: {},
      dueDate: new Date(),
    });
  };

  return (
    <ModalWrapper
      open={open}
      setOpen={(value) => {
        setOpen(value);
        setFormData({
          title: "",
          description: "",
          priority: "normal",
          stage: "todo",
          team: {},
          dueDate: new Date(),
        });
        if (!value && setTaskId) {
          setTaskId("");
        }
      }}
    >
      <div className="flex flex-col md:flex-row gap-4 p-6">
        {/* Left Section: Task Details */}
        <form onSubmit={handleSubmit} className="space-y-3 flex-1 text-sm">
          <h2 className="text-lg font-semibold mb-3">
            {taskId ? "Update Task" : "Create Task"}
          </h2>

          {/* Title */}
          <div>
            <label htmlFor="title" className="block font-medium mb-1">
              Title *
            </label>
            <FormInput
              type="text"
              name="title"
              value={formData.title}
              onChange={(id, value) => handleChange(id, value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
              placeholder="Enter task title"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block font-medium mb-1">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                handleChange(e.target.name, e.target.value)
              }
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
              placeholder="Enter task description"
            ></textarea>
          </div>

          {/* Priority */}
          <div>
            <label htmlFor="priority" className="block font-medium mb-1">
              Priority
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                handleChange(e.target.name, e.target.value)
              }
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="normal">Normal</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* Stage */}
          <div>
            <label htmlFor="stage" className="block font-medium mb-1">
              Stage
            </label>
            <select
              name="stage"
              value={formData.stage}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                handleChange(e.target.name, e.target.value)
              }
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
            >
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="qa-testing">Ready For QA Testing</option>
              <option value="pm-testing">Ready For PM Testing</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Due Date */}
          <div>
            <label htmlFor="dueDate" className="block font-medium mb-1">
              Due Date
            </label>
            <DatePicker
              selected={formData.dueDate}
              onChange={(date) => handleChange("dueDate", date)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
              dateFormat="MM/dd/yyyy"
            />
          </div>

          {/* Team Assignment */}
          <div>
            <label htmlFor="team" className="block font-medium mb-1">
              Assign Team
            </label>
            <Select
              options={projectTeamListFunction()}
              value={formData.team}
              onChange={handleTeamChange}
              className="react-select-container"
              classNamePrefix="react-select"
              placeholder="Select team members"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-400"
          >
            {taskId ? "Update Task" : "Create Task"}
          </button>
        </form>

        {/* Right Section: Comments and Subtasks */}
        {taskId && (
          <div className="flex-1 space-y-4 text-sm">
            {/* Comments */}
            <div>
              <h3 className="text-base font-semibold mb-2">Comments</h3>
              <div className="space-y-2">
                {comments?.length > 0 ? (
                  comments.map((comment: TaskComment, index) => (
                    <div
                      key={index}
                      className="p-2 bg-gray-100 rounded border border-gray-200"
                    >
                      <div className="flex items-center space-x-2 mb-1">
                        <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center">
                          {comment.userName?.[0]?.toUpperCase()}
                        </div>
                        <span className="font-semibold">
                          {comment.userName}
                        </span>
                      </div>
                      <p className="text-xs text-gray-800">
                        {comment?.comment}
                      </p>
                      <div className="text-xs text-gray-600">
                        {formatDate(new Date(comment?.createdAt))}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-500">No Comments</p>
                )}
              </div>
              <div className="mt-3 flex space-x-2 items-center">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment"
                  className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
                <button
                  onClick={handleCommentSubmit}
                  className="text-blue-500 hover:text-blue-600 text-xl"
                >
                  <FaPlusCircle />
                </button>
              </div>
            </div>

            {/* Subtasks */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold">Subtasks</h3>
                <button
                  onClick={() => setOpenCreateSubtask(true)}
                  className="text-blue-500 hover:text-blue-600 text-xl"
                >
                  <FaPlusCircle />
                </button>
              </div>
              <div className="space-y-2">
                {subTasks.map((subTask: SubTask) => (
                  <div
                    key={subTask.subTaskId}
                    className="flex justify-between items-center bg-gray-100 p-2 rounded"
                    style={{ height: "40px" }}
                  >
                    <div className="flex items-center">
                      <span>{subTask.title}</span>
                      <div className="ml-2 text-xs text-gray-500">
                        {formatDate(new Date(subTask.dueDate))}
                      </div>
                    </div>

                    <div className="flex space-x-2 items-center">
                      <select
                        value={subTask.status}
                        onChange={(e) =>
                          handleSubTaskStatusChange(
                            subTask.subTaskId,
                            e.target.value
                          )
                        }
                        className="px-2 py-1 border rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
                      >
                        <option value="todo">To Do</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                      <FaEdit
                        onClick={() => {
                          setSubTaskId(subTask.subTaskId);
                          setTimeout(() => {
                            setOpenCreateSubtask(true);
                          }, 500);
                        }}
                        className="text-gray-500 cursor-pointer"
                      />
                      <FaTrashAlt
                        onClick={() => {
                          dispatch(
                            taskApi.subTaskDelete({
                              subTaskId: subTask.subTaskId,
                            })
                          );
                          dispatch(taskApi.viewTask({ taskId }));
                        }}
                        className="text-red-500 cursor-pointer"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <CreateSubTasks
                open={openCreateSubtask}
                setOpen={setOpenCreateSubtask}
                taskId={taskId || ""}
                subTaskId={subTaskId}
              />
            </div>
          </div>
        )}
      </div>
    </ModalWrapper>
  );
};

export default CreateTask;
