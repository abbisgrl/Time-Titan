import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ModalWrapper from "../../components/ModalWrapper";
import Button from "../../components/Button";
import FormInput from "../../components/FormInput";
import { uploadFileToS3 } from "../../misc/awsFunctions";
import { AppDispatch, RootState } from "../../store";
import { createProject } from "../../slices/project/projectSlices";

const AddProject = ({
  open,
  setOpen,
  data,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  data: any;
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const userDetails = useSelector((state: RootState) => state.userDetails);

  const createProjectData = useSelector(
    (state: RootState) => state.createProject?.data
  );

  const [errors, setErrors] = useState({
    name: { message: "", state: false },
    description: { message: "", state: false },
    logo: { message: "", state: false },
  });
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    logo: "",
  });

  const handleChange = (id: string, value: any) => {
    setFormData((data) => ({ ...data, [id]: value }));
  };

  const handleUpload = async (file: any) => {
    if (!file) return alert("Please select a file first!");

    try {
      const bucketName = "gyanendra-logo-bucket";
      const key = `logo/${file.name}`;
      const logoUrl = await uploadFileToS3(file, bucketName, key);
      setFormData((data) => ({ ...data, logo: logoUrl }));
    } catch (error) {
      console.log("Error uploading file: " + error);
    }
  };

  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { data } = userDetails;
    const { name, email, userId } = data || {};
    const owner = { name, email, userId };
    dispatch(createProject({ ...formData, owner }));
  };

  const isLoading = false;
  const isUpdating = false;

  return (
    <>
      <ModalWrapper open={open} setOpen={setOpen}>
        <form onSubmit={handleOnSubmit} className="">
          <h2 className="text-base font-bold leading-6 text-gray-900 mb-4">
            {data ? "UPDATE PROFILE" : "ADD NEW USER"}
          </h2>

          <div className="mt-2 flex flex-col gap-6">
            <FormInput
              placeholder="Project Name"
              type="text"
              name="name"
              label="Project Name"
              className="w-full rounded"
              error={errors.name?.state ? errors.name.message : ""}
              onChange={(id: string, value: any) => handleChange(id, value)}
              value={formData.name}
            />
            <FormInput
              placeholder="Description"
              type="text"
              name="description"
              label="Description"
              className="w-full rounded"
              error={
                errors.description?.state ? errors.description.message : ""
              }
              onChange={(id: string, value: any) => handleChange(id, value)}
              value={formData.description}
            />

            <div className="relative flex items-center justify-center w-24 h-24 border-2 border-dashed border-gray-300 rounded-md">
              {formData.logo ? (
                <div className="relative w-full h-full">
                  <img
                    src={formData.logo}
                    alt="logo"
                    className="object-contain w-full h-full rounded-md"
                  />
                  {/* Cross Icon */}
                  <button
                    className="absolute top-1 left-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    onClick={() => {
                      handleChange("logo", "");
                    }}
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div className="relative flex flex-col items-center justify-center w-full h-full text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <span className="mt-2 text-sm font-medium">Upload Logo</span>
                  <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleUpload(file);
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {isLoading || isUpdating ? (
            <div className="py-5">Loading</div>
          ) : (
            <div className="py-3 mt-4 sm:flex sm:flex-row-reverse">
              <Button
                type="submit"
                className="bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700  sm:w-auto"
                label="Submit"
              />

              <Button
                type="button"
                className="bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto"
                onClick={() => setOpen(false)}
                label="Cancel"
              />
            </div>
          )}
        </form>
      </ModalWrapper>
    </>
  );
};

export default AddProject;
