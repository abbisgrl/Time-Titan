export type RoleOption = {
  value: string;
  label: string;
};

export const roleMap = {
  A: "Admin",
  D: "Developer",
  T: "Tester",
  PM: "Project Manager",
};

export const roles: RoleOption[] = [
  { label: "Admin", value: "A" },
  { label: "Developer", value: "D" },
  { label: "Tester", value: "T" },
  { label: "Product Manager", value: "PM" },
];

export const getInitials = (fullName: string) => {
  const names = fullName?.split(" ");

  const initials = names?.slice(0, 2).map((name) => name[0].toUpperCase());

  const initialsStr = initials?.join("");

  return initialsStr;
};
export const PRIORITY_STYLES = {
  high: "text-red-600",
  medium: "text-yellow-600",
  low: "text-blue-600",
  normal: "text-gray-600",
};

export const TASK_TYPE = {
  todo: "bg-blue-600",
  "in-progress": "bg-yellow-600",
  completed: "bg-green-600",
  "qa-testing": "bg-sky-600",
  "pm-testing": "bg-purple-600",
};

export const BGS = [
  "bg-blue-600",
  "bg-yellow-600",
  "bg-red-600",
  "bg-green-600",
];

export const formatDate = (date: any) => {
  // Get the month, day, and year
  const month = date.toLocaleString("en-US", { month: "short" });
  const day = date.getDate();
  const year = date.getFullYear();

  const formattedDate = `${day}-${month}-${year}`;

  return formattedDate;
};

export const dateFormatter = (dateString: any) => {
  const inputDate: any = new Date(dateString);

  if (isNaN(inputDate)) {
    return "Invalid Date";
  }

  const year = inputDate.getFullYear();
  const month = String(inputDate.getMonth() + 1).padStart(2, "0");
  const day = String(inputDate.getDate()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
};
