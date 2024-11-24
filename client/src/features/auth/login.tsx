import "./login.css";
import CoverImage from "../../assets/logo.png";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { loginApi } from "../../slices/auth/authSlices";
import { AppDispatch, RootState } from "../../store";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const dispatch = useDispatch<AppDispatch>();
  const loginReducer = useSelector((state: RootState) => state.login);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(loginReducer);
    if (loginReducer.status === "success") {
      Cookies.set("token", loginReducer?.data?.token || "");
      navigate("/");
      console.log(loginReducer.data);
    } else if (loginReducer.status === "failed") {
      console.log(loginReducer.data);
    }
  }, [JSON.stringify(loginReducer)]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    dispatch(loginApi(formData));
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
          Manage Your Projects Efficiently
        </h1>
        <p className="text-lg text-center">
          Stay organized and boost productivity with our all-in-one project and
          task management tool. Plan, track, and collaborate seamlessly!
        </p>
      </div>

      {/* Login form */}
      <div className="flex w-full md:w-1/2 items-center justify-center p-6">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Login to your account
          </h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
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
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
