export type teamOption = {
  label?: string;
  value?: string;
};

export type SubTask = {
  createdAt: string;
  description: string;
  dueDate: string;
  subTaskId: string;
  taskId: string;
  title: string;
  updatedAt: string;
  status: string;
  __v: number;
  _id: string;
};

export type TaskComment = {
  commentId: string;
  createdAt: string;
  taskId: string;
  updatedAt: string;
  userId: string;
  userName: string;
  userLogo: string;
  __v: number;
  _id: string;
  comment: string;
};

export interface TabItem {
  title: string;
  icon: React.ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  setSelected: (selectedIndex: number) => void;
  children: React.ReactNode;
  selected: number;
}
