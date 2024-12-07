import React, { useCallback, useEffect, useState } from "react";
import FormInput from "../../components/FormInput";
import ModalWrapper from "../../components/ModalWrapper";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Import the CSS
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { teamApi } from "../../slices/team/teamSlices";
import { taskApi } from "../../slices/task/taskSlices";

type teamOption = {
  label?: string;
  value?: string;
};

const CreateTask = ({
  open,
  setOpen,
  currentProject,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  currentProject: { projectId: "" };
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const projectTeamList = useSelector(
    (state: RootState) => state.teamReducer.projectsTeamList
  );

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "normal",
    stage: "todo",
    subTasks: [],
    assets: [],
    team: {},
    dueDate: new Date(),
  });

  useEffect(() => {
    if (currentProject.projectId) {
      dispatch(teamApi.projectTeamList(currentProject.projectId));
    }
  }, [currentProject]);

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
    const taskData = { ...formData, projectId: currentProject.projectId };
    dispatch(taskApi.create(taskData));
  };

  return (
    <ModalWrapper open={open} setOpen={setOpen}>
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
            <option value="in progress">In Progress</option>
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
          Create Task
        </button>
      </form>
    </ModalWrapper>
  );
};

export default CreateTask;
