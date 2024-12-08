import { useEffect, useState } from "react";
import CreateTask from "./components/create/createTasks";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { taskApi } from "../../slices/task/taskSlices";
import { FaList } from "react-icons/fa";
import { MdGridView } from "react-icons/md";
import { useParams } from "react-router-dom";
import { IoMdAdd } from "react-icons/io";
import BoardView from "./components/views/boardView";
import Title from "../../components/title";
import Button from "../../components/Button";
import Tabs from "./components/sharedComponents/tabs";
import TaskTitle from "./components/sharedComponents/taskTitle";
import Table from "./components/views/table";

const TABS = [
  { title: "Board View", icon: <MdGridView /> },
  { title: "List View", icon: <FaList /> },
];

const TASK_TYPE = {
  todo: "bg-blue-600",
  "in progress": "bg-yellow-600",
  completed: "bg-green-600",
};

const Tasks = () => {
  const params = useParams();

  const [selected, setSelected] = useState(0);
  const [loading, setLoading] = useState(false);
  const [openAddTask, setOpenAddTask] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const tasks = useSelector(
    (state: RootState) => state.taskReducer?.list?.data?.taskData
  );
  const currentProject: any = useSelector(
    (state: RootState) => state.navbarReducer.currentProject
  );

  useEffect(() => {
    if (currentProject.projectId) {
      dispatch(
        taskApi.list({ projectId: currentProject.projectId, status: "" })
      );
    }
  }, [currentProject]);

  const status = params?.status || "";

  return loading ? (
    <div className="py-10">loading...</div>
  ) : (
    <div className="w-full p-6 bg-gray-50 rounded-lg shadow-md">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <Title title={status ? `${status} Tasks` : "Tasks"} className="" />
        {!status && (
          <Button
            onClick={() => setOpenAddTask(true)}
            label="Create Task"
            icon={<IoMdAdd className="text-lg" />}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md py-2 px-4 transition duration-300"
          />
        )}
      </div>

      {/* Tabs Section */}
      <Tabs tabs={TABS} setSelected={setSelected} selected={selected}>
        {!status && (
          <div className="grid grid-cols-3 gap-6 mb-6">
            <TaskTitle label="To Do" className={TASK_TYPE.todo} />
            <TaskTitle
              label="In Progress"
              className={TASK_TYPE["in progress"]}
            />
            <TaskTitle label="completed" className={TASK_TYPE.completed} />
          </div>
        )}

        {/* Task Views */}
        {selected === 0 ? (
          <BoardView tasks={tasks} />
        ) : (
          <div className="w-full overflow-hidden bg-white rounded-lg shadow-sm">
            <Table tasks={tasks} />
          </div>
        )}
      </Tabs>

      {/* Add Task Modal */}
      <CreateTask
        open={openAddTask}
        setOpen={setOpenAddTask}
        currentProject={currentProject}
      />
    </div>
  );
};

export default Tasks;
