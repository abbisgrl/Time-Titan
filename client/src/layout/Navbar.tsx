import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Logo from "../assets/logo.png";
import AddProject from "../features/project/AddProject";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { ProjectList } from "../slices/project/projectSlices";
import {
  searchTextReducer,
  selectCurrentProject,
} from "../slices/layout/navbar";
import useDidMountEffect from "../misc/useDidMountEffect";
import usePrevious from "../misc/usePrevious";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false); // New state for profile dropdown
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const dispatch = useDispatch<AppDispatch>();
  const [projectList, setProjectList] = useState<ProjectList[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProjectList | null>(
    null
  );

  const searchTextPrev = usePrevious(searchText);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const projectListReducer = useSelector(
    (state: RootState) => state.projectReducer.list
  );

  const { name } = useSelector((state: RootState) => state.userDetails?.data);

  useEffect(() => {
    if (projectListReducer.status === "success") {
      setProjectList(projectListReducer.data);
      setSelectedProduct(projectListReducer.data[0] || null);
    }
  }, [projectListReducer.status]);

  useEffect(() => {
    if (Object.keys(selectedProduct || {}).length) {
      dispatch(selectCurrentProject(selectedProduct));
    }
  }, [selectedProduct]);

  useDidMountEffect(() => {
    if (searchTextPrev ?? false) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        dispatch(searchTextReducer(searchText));
        timeoutRef.current = null;
      }, 700);

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }
  }, [searchText]);

  useDidMountEffect(() => {
    if (searchText) {
      setSearchText("");
    }
  }, [location]);

  const handleProductSelect = (product: ProjectList) => {
    setSelectedProduct(product);
    setDropdownOpen(false);
  };

  const handleLogout = () => {
    Cookies.remove("token");
    navigate("/login");
  };

  return (
    <div>
      <div className="bg-white">
        <div className="flex-col flex">
          <div className="w-full border-b-2 border-gray-200">
            <div className="bg-white h-16 justify-between items-center mx-auto px-4 flex">
              {/* Logo */}
              <div>
                <img src={Logo} className="block h-16 w-auto" alt="Logo" />
              </div>

              {/* Responsive Search Box */}
              <div className="relative flex-1 lg:ml-40 mx-4">
                <p className="pl-3 items-center flex absolute inset-y-0 left-0 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </p>
                <input
                  placeholder="Type to search"
                  type="search"
                  className="border border-gray-300 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm w-full rounded-lg py-2 pl-10 pr-3
                  sm:w-48 md:w-64 lg:w-80 xl:w-[30rem] transition-all"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearchText(e.target.value)
                  }
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === "Enter") {
                      if (timeoutRef.current) {
                        clearTimeout(timeoutRef.current);
                      }
                      dispatch(searchTextReducer(searchText));
                    }
                  }}
                  value={searchText}
                />
              </div>

              {/* Project switcher */}
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="bg-gray-100 border border-gray-300 text-sm text-gray-700 rounded-lg px-3 py-1 flex items-center space-x-2 hover:bg-gray-200 transition"
                >
                  <span>{selectedProduct?.name || "Select a project"}</span>
                  <svg
                    className={`w-4 h-4 transform transition ${
                      dropdownOpen ? "rotate-180" : "rotate-0"
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-lg border border-gray-200 z-50">
                    {projectList.map((product) => (
                      <p
                        key={product.projectId}
                        onClick={() => handleProductSelect(product)}
                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                      >
                        {product.name}
                      </p>
                    ))}
                  </div>
                )}
              </div>

              {/* Add Project Button */}
              <button
                onClick={() => setOpen(!open)}
                className="text-indigo-600 text-sm flex items-center space-x-1 hover:text-indigo-700 transition ml-2"
              >
                <svg
                  className="w-4 h-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </button>

              {/* User Info */}
              <div className="relative ml-2">
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                >
                  <img
                    src="https://static01.nyt.com/images/2019/11/08/world/08quebec/08quebec-superJumbo.jpg"
                    className="object-cover h-9 w-9 rounded-full mr-2 bg-gray-300"
                    alt="User Avatar"
                  />
                  <p className="font-semibold text-sm">{name}</p>
                </div>
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-lg border border-gray-200 z-50">
                    <p
                      onClick={handleLogout}
                      className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                    >
                      Logout
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <AddProject open={open} setOpen={setOpen} />
    </div>
  );
};

export default Navbar;
