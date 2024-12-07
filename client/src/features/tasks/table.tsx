import React, { useState } from "react";
import { BiMessageAltDetail } from "react-icons/bi";
import {
  MdAttachFile,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { BGS, PRIOTITYSTYELS, TASK_TYPE, formatDate } from "../../misc/index";
import clsx from "clsx";
import { FaList } from "react-icons/fa";
import Button from "../../components/Button";
import UserInfo from "./userInfo";

// Define types for the task object and team members
interface Task {
  _id: string;
  title: string;
  stage: keyof typeof TASK_TYPE; // Assuming TASK_TYPE has defined stages
  priority: keyof typeof PRIOTITYSTYELS;
  date: string;
  activities: any[];
  assets: any[];
  subTasks: any[];
  team: { _id: string; name: string }[];
}

interface TableProps {
  tasks: Task[];
}

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const Table = ({ tasks }: TableProps) => {
  const deleteClicks = (taskId: string) => {
    console.log("Deleting task with ID:", taskId);
  };

  const deleteHandler = () => {
    // Implement your delete logic here
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
        <div className="flex items-center gap-2">
          <span className={clsx("text-lg", PRIOTITYSTYELS[task?.priority])}>
            {ICONS[task?.priority]}
          </span>
          <span className="capitalize">{task?.priority} Priority</span>
        </div>
      </td>

      <td className="py-3 px-3">
        <span className="text-sm text-gray-600">
          {formatDate(new Date(task?.date))}
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
            <span>0/{task?.subTasks?.length}</span>
          </div>
        </div>
      </td>

      <td className="py-3 px-3">
        <div className="flex -space-x-2">
          {task?.team?.map((m, index) => (
            <div
              key={m._id}
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
        />
        <Button
          className="text-red-700 hover:text-red-500 text-sm ml-3"
          label="Delete"
          type="button"
          onClick={() => deleteClicks(task._id)}
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
                tasks.map((task, index) => (
                  <TableRow key={task._id} task={task} />
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
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
    </>
  );
};

export default Table;
