import { Task } from "../../../../slices/task/taskSlices";
import TaskCard from "../sharedComponents/taskCard";

const BoardView = ({ tasks, status }: { tasks: Task[]; status?: string }) => {
  if (status) {
    return (
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {tasks?.map((task, index) => (
          <TaskCard task={task} key={index} />
        ))}
      </div>
    );
  }

  const categorizedTasks = {
    todo: tasks?.filter((task) => task.stage === "todo"),
    inProgress: tasks?.filter((task) => task.stage === "in-progress"),
    qaTesting: tasks?.filter((task) => task.stage === "qa-testing"),
    pmTesting: tasks?.filter((task) => task.stage === "pm-testing"),
    completed: tasks?.filter((task) => task.stage === "completed"),
  };

  return (
    <div className="w-full grid grid-cols-5 gap-6">
      {Object.keys(categorizedTasks).map((category) => (
        <div key={category} className="flex flex-col gap-4">
          {categorizedTasks[category as keyof typeof categorizedTasks]?.map(
            (task, index) => (
              <TaskCard task={task} key={index} />
            )
          )}
        </div>
      ))}
    </div>
  );
};

export default BoardView;
