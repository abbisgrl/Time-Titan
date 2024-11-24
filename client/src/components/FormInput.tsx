import React from "react";

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      type = "text",
      placeholder,
      label,
      className,
      name,
      error,
    }: FormInputProps,
    ref
  ) => {
    return (
      <div className="w-full flex flex-col gap-1">
        {label && (
          <label htmlFor={name} className="text-slate-800">
            {label}
          </label>
        )}

        <div>
          <input
            type={type}
            name={name}
            placeholder={placeholder}
            ref={ref}
            aria-invalid={error ? "true" : "false"}
            className={`bg-transparent px-3 py-2.5 2xl:py-3 border border-gray-300 placeholder-gray-400 text-gray-900 outline-none text-base focus:ring-2 ring-blue-300 ${className}`}
          />
        </div>
        {error && (
          <span className="text-xs text-[#f64949fe] mt-0.5">{error}</span>
        )}
      </div>
    );
  }
);

interface FormInputProps {
  type?: string;
  placeholder: string;
  label?: string;
  className?: string;
  name: string;
  error?: string;
}

export default FormInput;
