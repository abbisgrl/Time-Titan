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
import BoardViewLoader from "./BoardViewLoader";
import TeamListingLoader from "../team/teamListingLoader";
import NoRecordsFound from "../../components/NoRecordsFound";
import usePrevious from "../../misc/usePrevious";
import useDidMountEffect from "../../misc/useDidMountEffect";

const TABS = [
  { title: "Board View", icon: <MdGridView /> },
  { title: "List View", icon: <FaList /> },
];

const TASK_TYPE = {
  todo: "bg-blue-600",
  "in progress": "bg-yellow-600",
  completed: "bg-green-600",
  "qa testing": "bg-sky-600",
  "pm testing": "bg-purple-600",
};

const Tasks = () => {
  const params = useParams();
  const [selected, setSelected] = useState(0);
  const [openAddTask, setOpenAddTask] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const tasksListReducer = useSelector(
    (state: RootState) => state.taskReducer?.list
  );

  const currentProject = useSelector(
    (state: RootState) => state.navbarReducer.currentProject
  );

  const deleteTaskReducer = useSelector(
    (state: RootState) => state.taskReducer.trashTask
  );

  const searchTextReducer = useSelector(
    (state: RootState) => state.navbarReducer.searchText
  );

  const tasks = tasksListReducer?.data?.taskData;
  const status = params?.status || "";

  const openAddTaskPrev = usePrevious(openAddTask);
  const searchTextReducerPrev = usePrevious(searchTextReducer);

  useDidMountEffect(() => {
    fetchTaskList();
  }, [currentProject, status]);

  useEffect(() => {
    if (openAddTaskPrev && openAddTaskPrev !== openAddTask && !openAddTask) {
      const timer = setTimeout(() => {
        fetchTaskList();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [openAddTask]);

  useEffect(() => {
    if (deleteTaskReducer.status === "success") {
      fetchTaskList();
    }
  }, [deleteTaskReducer.status]);

  useEffect(() => {
    if (searchTextReducerPrev !== undefined) {
      fetchTaskList(searchTextReducer);
    }
  }, [searchTextReducer]);

  const fetchTaskList = (searchTextReducer: string = "") => {
    if (currentProject.projectId) {
      dispatch(
        taskApi.list({
          projectId: currentProject.projectId,
          status,
          isTrashed: false,
          searchText: searchTextReducer,
        })
      );
    }
  };

  const getLoader = () => {
    if (selected === 0) {
      return <BoardViewLoader />;
    }
    return <TeamListingLoader />;
  };

  const handleDeleteTask = (taskId: string) => {
    dispatch(taskApi.trashTask({ taskId }));
  };

  const getListComponent = () => {
    if (tasks?.length) {
      if (selected === 0) {
        return (
          <BoardView
            tasks={tasks}
            status={status}
            handleDeleteTask={handleDeleteTask}
          />
        );
      }
      return (
        <div className="w-full overflow-hidden bg-white rounded-lg shadow-sm">
          <Table tasks={tasks} handleDeleteTask={handleDeleteTask} />
        </div>
      );
    } else {
      return (
        <NoRecordsFound
          buttonLabel="Create Task"
          onButtonClick={setOpenAddTask}
        />
      );
    }
  };

  return (
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
          <div className="grid grid-cols-5 gap-6 mb-6">
            <TaskTitle label="To Do" className={TASK_TYPE.todo} />
            <TaskTitle
              label="In Progress"
              className={TASK_TYPE["in progress"]}
            />
            <TaskTitle
              label="Ready To QA testing"
              className={TASK_TYPE["qa testing"]}
            />
            <TaskTitle
              label="Ready To PM testing"
              className={TASK_TYPE["pm testing"]}
            />
            <TaskTitle label="Completed" className={TASK_TYPE.completed} />
          </div>
        )}

        {["idle", "pending"].includes(tasksListReducer?.status)
          ? getLoader()
          : getListComponent()}
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
