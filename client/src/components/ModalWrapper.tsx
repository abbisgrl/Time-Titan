import React from "react";
import Modal from "react-modal";

Modal.setAppElement("#root"); // Required for accessibility

const ModalWrapper = ({
  open,
  setOpen,
  children,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  children: React.ReactNode;
}) => {
  return (
    <Modal
      isOpen={open}
      overlayClassName="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50"
      className="relative bg-white rounded-lg shadow-xl w-full max-w-lg mx-auto p-6"
    >
      <button
        onClick={() => setOpen(false)}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
      <div>{children}</div>
    </Modal>
  );
};

export default ModalWrapper;
