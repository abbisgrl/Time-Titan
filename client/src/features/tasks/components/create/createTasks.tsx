import React, { useCallback, useEffect, useState } from "react";
import FormInput from "../../../../components/FormInput";
import ModalWrapper from "../../../../components/ModalWrapper";
import Select, { SingleValue } from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store";
import { teamApi } from "../../../../slices/team/teamSlices";
import { Task, taskApi } from "../../../../slices/task/taskSlices";
import { formatDate } from "../../../../misc";
import CreateSubTasks from "./createSubTasks";
import { FaTrashAlt, FaEdit, FaPlusCircle } from "react-icons/fa";
import { SubTask, TaskComment, teamOption } from "../../tasksTypes";
import useDidMountEffect from "../../../../misc/useDidMountEffect";

const CreateTask = ({
  open,
  setOpen,
  currentProject,
  taskId,
  setTaskId,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  currentProject?: { projectId: string };
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
  const { isAdmin, isOwner, userId } = useSelector(
    (state: RootState) => state.userDetails?.data
  );
  const taskCommentReducer = useSelector(
    (state: RootState) => state.taskReducer.addComment
  );
  const taskCreateReducer = useSelector(
    (state: RootState) => state.taskReducer.create
  );
  const taskUpdateReducer = useSelector(
    (state: RootState) => state.taskReducer.updateTask
  );

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
      const taskDetails = viewTask?.data?.taskDetails;
      if (!taskDetails) return;
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
        team: string[];
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
      setTimeout(() => {
        if (taskId) {
          dispatch(taskApi.viewTask({ taskId: taskId || "" }));
        }
      }, 1000);
    }
  }, [openCreateSubtask]);

  useEffect(() => {
    if (taskCommentReducer?.status === "success" && taskId) {
      dispatch(taskApi.viewTask({ taskId: taskId || "" }));
    }
  }, [taskCommentReducer]);

  useEffect(() => {
    if (taskCreateReducer?.status === "success") {
      setOpen(false);
      setFormData({
        title: "",
        description: "",
        priority: "normal",
        stage: "todo",
        team: {},
        dueDate: new Date(),
      });
    }
  }, [taskCreateReducer]);

  useEffect(() => {
    if (taskUpdateReducer?.status === "success") {
      setOpen(false);
      setFormData({
        title: "",
        description: "",
        priority: "normal",
        stage: "todo",
        team: {},
        dueDate: new Date(),
      });
    }
  }, [taskUpdateReducer]);

  const projectTeamListFunction = useCallback((): teamOption[] => {
    return (
      projectTeamList?.data?.map((team) => ({
        value: team.userId,
        label: team.name,
      })) || []
    );
  }, [projectTeamList]);

  const handleChange = (name: string, value: string | Date | teamOption) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleTeamChange = (newValue: SingleValue<teamOption>) => {
    if (newValue) {
      handleChange("team", newValue);
    }
  };

  const handleCommentSubmit = () => {
    const comment = {
      comment: newComment,
      taskId: taskId || "",
      userId,
    };
    dispatch(taskApi.addComment(comment));
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
              onChange={(date: Date | null) =>
                handleChange("dueDate", date || new Date())
              }
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
              onChange={(newValue) =>
                handleTeamChange(newValue as SingleValue<teamOption>)
              }
              value={formData.team}
              className="react-select-container"
              classNamePrefix="react-select"
              placeholder="Select team members"
              options={projectTeamListFunction()}
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
            {/* Comments and Subtasks Container */}
            <div className="flex flex-col h-full">
              {/* Comments */}
              <div className="overflow-y-auto flex-1 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold">Comments</h3>
                </div>
                <div className="space-y-3">
                  {comments.length ? (
                    comments.map((comment, index) => (
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
              </div>

              {/* Comment Input */}
              <div className="flex items-center mt-3 space-x-2">
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

              {/* Subtasks */}
              <div className="overflow-y-auto mt-4 flex-1">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold">Subtasks</h3>
                  {(isAdmin || isOwner) && (
                    <button
                      onClick={() => setOpenCreateSubtask(true)}
                      className="text-blue-500 hover:text-blue-600 text-xl"
                    >
                      <FaPlusCircle />
                    </button>
                  )}
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
                        {(isAdmin || isOwner) && (
                          <>
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
                          </>
                        )}
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
          </div>
        )}
      </div>
    </ModalWrapper>
  );
};

export default CreateTask;
