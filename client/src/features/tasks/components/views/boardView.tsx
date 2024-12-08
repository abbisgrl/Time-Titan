import { Task } from "../../../../slices/task/taskSlices";
import { TableProps } from "./table";
import TaskCard from "../sharedComponents/taskCard";

const BoardView = ({ tasks }: TableProps) => {
  return (
    <div className="w-full py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 2xl:gap-10">
      {tasks?.map((task: Task, index: number) => (
        <TaskCard task={task} key={index} />
      ))}
    </div>
  );
};

export default BoardView;
