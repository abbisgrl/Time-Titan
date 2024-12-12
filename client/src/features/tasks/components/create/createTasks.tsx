import React, { useCallback, useEffect, useState } from "react";
import FormInput from "../../../../components/FormInput";
import ModalWrapper from "../../../../components/ModalWrapper";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Import the CSS
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store";
import { teamApi } from "../../../../slices/team/teamSlices";
import { Task, taskApi } from "../../../../slices/task/taskSlices";

type teamOption = {
  label?: string;
  value?: string;
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

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "normal",
    stage: "todo",
    team: {},
    dueDate: new Date(),
  });

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
      const { title, description, priority, stage, dueDate, team } =
        taskDetails as Task & { team: any[] };
      const memberInfo = projectTeamList?.data?.filter(
        (t) => t.userId === team[0]
      );

      console.log({ memberInfo, team, dueDate });
      setFormData({
        title,
        description,
        priority,
        stage,
        dueDate: new Date(dueDate),
        team: { label: memberInfo[0].name, value: memberInfo[0].userId },
      });
    }
  }, [viewTask.status]);

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const taskData = { ...formData, projectId: currentProject?.projectId };
    if (taskId) {
      dispatch(taskApi.updateTask({ ...taskData, taskId }));
    } else {
      dispatch(taskApi.create(taskData));
    }
    setOpen(false);
  };

  return (
    <ModalWrapper
      open={open}
      setOpen={(value) => {
        setOpen(value);
        if (!value && setTaskId) {
          setTaskId("");
        }
      }}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-xl font-bold mb-4">Create Task</h2>

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
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {taskId ? "Update Task" : "Create Task"}
        </button>
      </form>
    </ModalWrapper>
  );
};

export default CreateTask;
