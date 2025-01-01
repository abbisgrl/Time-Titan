import React, { useEffect, useState } from "react";
import FormInput from "../../../../components/FormInput";
import ModalWrapper from "../../../../components/ModalWrapper";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store";
import { SubTaskData, taskApi } from "../../../../slices/task/taskSlices";

const CreateSubTasks = ({
  open,
  setOpen,
  taskId,
  subTaskId,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  taskId: string;
  subTaskId?: string;
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { subTaskDetails } = useSelector(
    (state: RootState) => state.taskReducer?.subTaskView?.data
  );

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: new Date(),
    tag: "",
  });

  useEffect(() => {
    if (subTaskId) {
      dispatch(taskApi.subTaskView({ subTaskId }));
    }
  }, [subTaskId]);

  useEffect(() => {
    if (Object.keys(subTaskDetails).length) {
      const { title, description, dueDate, tag } = subTaskDetails;
      setFormData({ title, description, dueDate, tag });
    }
  }, [subTaskDetails]);

  const handleChange = (name: string, value: any) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const subTaskData: Partial<SubTaskData> = { ...formData, taskId };
    if (subTaskId) {
      dispatch(taskApi.subTaskUpdate({ ...subTaskData, subTaskId }));
    } else {
      dispatch(taskApi.subTaskCreate(subTaskData));
    }
    setOpen(false);
  };

  return (
    <ModalWrapper open={open} setOpen={setOpen} minWidth="500px">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-xl font-bold mb-4">Create Subtask</h2>

        <div>
          <label htmlFor="title" className="block font-medium mb-1">
            Subtask Title *
          </label>
          <FormInput
            type="text"
            name="title"
            value={formData.title}
            onChange={(id, value) => handleChange(id, value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter subtask title"
          />
        </div>

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
            placeholder="Enter subtask description"
          ></textarea>
        </div>

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

        <div>
          <label htmlFor="tag" className="block font-medium mb-1">
            Tag
          </label>
          <FormInput
            type="text"
            name="tag"
            value={formData.tag}
            onChange={(id, value) => handleChange(id, value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter subtask tag"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {subTaskId ? "Update Subtask" : "Create Subtask"}
        </button>
      </form>
    </ModalWrapper>
  );
};

export default CreateSubTasks;
