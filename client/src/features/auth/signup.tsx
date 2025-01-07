import CoverImage from "../../assets/logo.png";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { signupApi } from "../../slices/auth/authSlices";
import { AppDispatch, RootState } from "../../store";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom"; // Import Link for navigation

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const dispatch = useDispatch<AppDispatch>();
  const signupReducer = useSelector((state: RootState) => state.signupReducer);
  const navigate = useNavigate();

  useEffect(() => {
    if (signupReducer.status === "success") {
      Cookies.set("token", signupReducer?.data?.token || "");
      navigate("/dashboard");
    } else if (signupReducer.status === "failed") {
      console.log(signupReducer.data);
    }
  }, [JSON.stringify(signupReducer)]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(signupApi(formData));
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
          Join Our Community
        </h1>
        <p className="text-lg text-center">
          Sign up to start managing your projects effectively. Collaborate and
          stay organized with our intuitive tools!
        </p>
      </div>

      {/* Signup form */}
      <div className="flex w-full md:w-1/2 items-center justify-center p-6">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Create an Account
          </h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-gray-600 mb-2" htmlFor="name">
                Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                onChange={(e) =>
                  setFormData((prevState) => ({
                    ...prevState,
                    name: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                onChange={(e) =>
                  setFormData((prevState) => ({
                    ...prevState,
                    email: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-2" htmlFor="password">
                Password
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
            <button
              type="submit"
              className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
            >
              Sign Up
            </button>
          </form>

          {/* Link to Login Page */}
          <p className="text-center mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 hover:underline">
              Click here to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
