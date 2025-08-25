import { useState, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiMenu, FiHome, FiLogOut } from "react-icons/fi";
import { VscRunAll } from "react-icons/vsc";
import { BsFileEarmarkText, BsGraphUp } from "react-icons/bs";
import { MdDevices } from "react-icons/md";
import { AuthContext } from "../../AuthContext"; // Import AuthContext
import { RiLogoutBoxRLine } from "react-icons/ri";

const SideNavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useContext(AuthContext); // Destructure logout function from AuthContext
  const navigate = useNavigate();

  const toggleSideNavBar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout(); // Call logout function from AuthContext
    navigate("/login", { replace: true });
  };

  return (
    <div
      className={`flex flex-col p-3 bg-blue-200 text-customText ${
        isOpen ? "w-64" : "w-20"
      } transition-all duration-300 ease-in-out relative`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div className="flex items-center justify-start ml-2">
        <button onClick={toggleSideNavBar}>
          <FiMenu size={24} />
        </button>
      </div>
      <nav className="mt-4 flex flex-col space-y-2 flex-grow">
        <NavLink
          to="/"
          className="flex items-center space-x-2 p-2 hover:bg-blue-400 rounded transition-opacity duration-300"
        >
          <FiHome size={24} />
          {isOpen && (
            <span className="text-customText font-bold opacity-100 transition-opacity duration-300">Dashboard</span>
          )}
        </NavLink>
        <NavLink
          to="/test-suite"
          className="flex items-center space-x-2 p-2 hover:bg-blue-400 rounded transition-opacity duration-300"
        >
          <BsFileEarmarkText size={24} />
          {isOpen && (
            <span className="text-customText font-bold opacity-100 transition-opacity duration-300">
              Test Suite Mgmt
            </span>
          )}
        </NavLink>
        <NavLink
          to="/run-from-template"
          className="flex items-center space-x-2 p-2 hover:bg-blue-400 rounded transition-opacity duration-300"
        >
          <VscRunAll size={24} />
          {isOpen && (
            <span className="text-customText font-bold opacity-100 transition-opacity duration-300">
              Run Test Suite
            </span>
          )}
        </NavLink>
        {/* <NavLink
          to="/test-case-management"
          className="flex items-center space-x-2 p-2 hover:bg-blue-400 rounded transition-opacity duration-300"
        >
          <BsFileEarmarkText size={24} />
          {isOpen && (
            <span className="text-customText font-bold opacity-100 transition-opacity duration-300">Test Case Mgmt</span>
          )}
        </NavLink> */}
        <NavLink
          to="/test-results"
          className="flex items-center space-x-2 p-2 hover:bg-blue-400 rounded transition-opacity duration-300"
        >
          <BsGraphUp size={24} />
          {isOpen && (
            <span className="text-customText font-bold opacity-100 transition-opacity duration-300">Test Results</span>
          )}
        </NavLink>
        <NavLink
          to="/device-management"
          className="flex items-center space-x-2 p-2 hover:bg-blue-400 rounded transition-opacity duration-300"
        >
          <MdDevices size={24} />
          {isOpen && (
            <span className="text-customText font-bold opacity-100 transition-opacity duration-300">Device Mgmt</span>
          )}
        </NavLink>
        <hr className="my-2 border-t border-gray-500" />

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 p-2 hover:bg-red-400 rounded transition-opacity duration-300 w-full"
        >
          <RiLogoutBoxRLine size={24} />
          {isOpen && (
            <span className="text-customText font-bold opacity-100 transition-opacity duration-300">Logout</span>
          )}
        </button>
      </nav>
    </div>
  );
};

export default SideNavBar;
