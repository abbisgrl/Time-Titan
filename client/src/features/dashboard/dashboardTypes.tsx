export interface DashboardTask {
  createdAt: string;
  description: string;
  priority: string;
  stage: string;
  taskId: string;
  title: string;
  dueDate: string;
  team: string[];
}
export interface CardDetails {
  todo: number;
  "qa-testing": number;
  [key: string]: number;
}
export interface DashboardData {
  message: string;
  cardDetails: CardDetails;
}
export interface TaskListData {
  message: string;
  taskList: DashboardTask[];
}
export interface TaskListResponse {
  status: string;
  data: TaskListData;
}
export interface DashboardResponse {
  status: string;
  data: DashboardData;
}
