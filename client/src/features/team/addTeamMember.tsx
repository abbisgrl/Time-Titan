import React, { useCallback, useEffect, useState } from "react";
import Select, { MultiValue } from "react-select";
import { useDispatch, useSelector } from "react-redux";
import ModalWrapper from "../../components/ModalWrapper";
import Button from "../../components/Button";
import FormInput from "../../components/FormInput";
import { AppDispatch, RootState } from "../../store";
import { TeamData, User, teamApi } from "../../slices/team/teamSlices";
import { roleMap, roles } from "../../misc";
import { ProjectOption } from "./teamTypes";

const AddTeamMember = ({
  open,
  setOpen,
  teamId = "",
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  teamId: string;
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const projectData = useSelector(
    (state: RootState) => state.projectReducer.list
  );
  const ownerDetails = useSelector((state: RootState) => state.userDetails);
  const teamMemberDetails = useSelector(
    (state: RootState) => state.teamReducer.details
  );

  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    password: string;
    role: ProjectOption;
    projects: ProjectOption[];
  }>({
    name: "",
    email: "",
    password: "",
    role: { label: "Admin", value: "A" },
    projects: [],
  });

  const [errors] = useState({
    name: { message: "", state: false },
    email: { message: "", state: false },
    password: { message: "", state: false },
    role: { message: "", state: false },
    project: { message: "", state: false },
  });

  useEffect(() => {
    if (teamId) {
      dispatch(teamApi.details(teamId));
    }
  }, [teamId]);

  useEffect(() => {
    if (teamMemberDetails?.status === "success") {
      const { name, email, memberPassword, role, projects } =
        (teamMemberDetails.data as { usersDetails: User[] }).usersDetails[0] ||
        {};

      const userRole =
        role && roleMap[role as keyof typeof roleMap]
          ? { label: roleMap[role as keyof typeof roleMap], value: role }
          : { label: "Admin", value: "A" };

      const userProjects = projects?.map((pro) => {
        const projectInfo = ProjectList().filter(
          (project) => project.value === pro
        );
        return projectInfo[0];
      });

      const teamDetails: {
        name: string;
        email: string;
        password: string;
        role: ProjectOption;
        projects: ProjectOption[];
      } = {
        name: name || "",
        email: email || "",
        password: memberPassword || "",
        role: userRole,
        projects: userProjects || [],
      };
      setFormData(teamDetails);
    }
  }, [teamMemberDetails]);

  const ProjectList = useCallback((): ProjectOption[] => {
    return (
      projectData?.data?.map((project) => ({
        value: project.projectId,
        label: project.name,
      })) || []
    );
  }, [projectData]);

  const handleChange = (
    id: string,
    value: string | ProjectOption | ProjectOption[]
  ) => {
    setFormData((data) => ({ ...data, [id]: value }));
  };

  // Handle form submission
  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userRole = formData.role.value;
    const projectIds = formData.projects.map((project) => project.value);
    const teamData: TeamData = {
      ...formData,
      role: userRole,
      projects: projectIds,
      ownerId: ownerDetails?.data?.userId || "",
    };
    if (teamId) {
      dispatch(teamApi.update({ teamData, userId: teamId }));
    } else {
      dispatch(teamApi.create(teamData));
    }
  };

  return (
    <ModalWrapper open={open} setOpen={setOpen}>
      <form onSubmit={handleOnSubmit}>
        <h2 className="text-base font-bold leading-6 text-gray-900 mb-4">
          ADD NEW USER
        </h2>

        <div className="mt-2 flex flex-col gap-6">
          <FormInput
            placeholder="Full Name"
            type="text"
            name="name"
            label="Full Name"
            className="w-full rounded"
            error={errors.name?.state ? errors.name.message : ""}
            onChange={(
              id: string,
              value: string | ProjectOption | ProjectOption[]
            ) => handleChange(id, value)}
            value={formData.name}
          />
          <FormInput
            placeholder="Email"
            type="email"
            name="email"
            label="Email"
            className="w-full rounded"
            error={errors.email?.state ? errors.email.message : ""}
            onChange={(
              id: string,
              value: string | ProjectOption | ProjectOption[]
            ) => handleChange(id, value)}
            value={formData.email}
          />
          <FormInput
            placeholder="Password"
            type="password"
            name="password"
            label="Password"
            className="w-full rounded"
            error={errors.password?.state ? errors.password.message : ""}
            onChange={(
              id: string,
              value: string | ProjectOption | ProjectOption[]
            ) => handleChange(id, value)}
            value={formData.password}
          />

          {/* Role Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <Select
              options={roles}
              placeholder="Select Role"
              onChange={(selectedOption: ProjectOption | null) => {
                handleChange(
                  "role",
                  selectedOption || { label: "Admin", value: "A" }
                );
              }}
              classNamePrefix="react-select"
              defaultValue={formData.role}
            />
            {errors.role?.state && (
              <p className="text-red-600 text-sm mt-1">{errors.role.message}</p>
            )}
          </div>

          {/* Project Multi-Select Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project
            </label>
            <Select
              isMulti
              options={ProjectList()}
              placeholder="Select Projects"
              onChange={(selectedOptions: MultiValue<ProjectOption>) => {
                handleChange("projects", selectedOptions as ProjectOption[]);
              }}
              classNamePrefix="react-select"
              value={formData.projects}
            />
            {errors.project?.state && (
              <p className="text-red-600 text-sm mt-1">
                {errors.project.message}
              </p>
            )}
          </div>
        </div>

        <div className="py-3 mt-4 sm:flex sm:flex-row-reverse">
          <Button
            type="submit"
            className="bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700 sm:w-auto"
            label="Submit"
          />
          <Button
            type="button"
            className="bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto"
            onClick={() => setOpen(false)}
            label="Cancel"
          />
        </div>
      </form>
    </ModalWrapper>
  );
};

export default AddTeamMember;
