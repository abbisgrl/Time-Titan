import React, { useState } from "react";
import { useSelector } from "react-redux";
import ModalWrapper from "../../components/ModalWrapper";
import Button from "../../components/Button";
import FormInput from "../../components/FormInput";

const AddProject = ({
  open,
  setOpen,
  data,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  data: any;
}) => {
  const [errors, setErrors] = useState({
    name: { message: "", state: false },
    description: { message: "", state: false },
    logo: { message: "", state: false },
  });

  const isLoading = false,
    isUpdating = false;

  const handleOnSubmit = () => {};

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
            />
            <FormInput
              placeholder="Logo"
              type="image"
              name="logo"
              label="Logo"
              className="w-full rounded"
              error={errors.logo?.state ? errors.logo.message : ""}
            />
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
