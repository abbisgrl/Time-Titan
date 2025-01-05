import CoverImage from "../../assets/logo.png";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPasswordApi } from "../../slices/auth/authSlices";
import { AppDispatch, RootState } from "../../store";
import { useLocation, useNavigate } from "react-router-dom";

const CreatePassword = () => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const email = params.get("email");

  const createPasswordReducer = useSelector(
    (state: RootState) => state.createPasswordReducer
  );

  useEffect(() => {
    if (createPasswordReducer.status === "success") {
      navigate("/login");
    }
  }, [createPasswordReducer.status]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    setError(null);
    if (email) {
      dispatch(createPasswordApi({ email, password: formData.password }));
    } else {
      setError("Email does not found!");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left cover with animation */}
      <div className="hidden md:flex w-1/2 bg-blue-500 text-white items-center justify-center flex-col animate-fadeIn p-8">
        <img
          src={CoverImage}
          alt="Project Management Cover"
          className="w-3/4 mb-6 rounded-lg shadow-lg"
        />
        <h1 className="text-4xl font-bold animate-bounce mb-4">
          Secure Your Account
        </h1>
        <p className="text-lg text-center">
          Set a strong password to protect your projects and tasks. Your
          security is our priority.
        </p>
      </div>

      {/* Create Password form */}
      <div className="flex w-full md:w-1/2 items-center justify-center p-6">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Create a New Password
          </h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && <p className="text-red-500 text-center">{error}</p>}
            <div>
              <label className="block text-gray-600 mb-2" htmlFor="password">
                New Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                onChange={(e) =>
                  setFormData((prevState) => ({
                    ...prevState,
                    password: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <label
                className="block text-gray-600 mb-2"
                htmlFor="confirmPassword"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                onChange={(e) =>
                  setFormData((prevState) => ({
                    ...prevState,
                    confirmPassword: e.target.value,
                  }))
                }
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
            >
              Set Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePassword;
