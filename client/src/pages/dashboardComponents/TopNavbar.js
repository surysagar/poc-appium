import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiUser } from "react-icons/fi";
import { jwtDecode } from "jwt-decode";

const TopNavbar = () => {
  const [profileName, setProfileName] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      // If the token is missing, navigate to the login page
      navigate("/login");
    } else {
      try {
        // Decode the token to get the user's name
        const decodedToken = jwtDecode(token);
        setProfileName(decodedToken.name || "Profile");
      } catch (error) {
        console.error("Error decoding token:", error);
        // If the token is invalid, clear it and navigate to login
        localStorage.removeItem("access_token");
        navigate("/login");
      }
    }
  }, [navigate]);

  return (
    <header className="bg-blue-200 text-customText p-4 flex justify-between items-center">
      <NavLink to="/">
        <div className="h-10 cursor-pointer">
          <img src="/logo.png" alt="Logo" className="w-full h-full" />
        </div>
      </NavLink>
      <div className="flex items-center space-x-4">
        <FiUser size={24} />
        <span className="text-customText font-bold">{profileName}</span>
      </div>
    </header>
  );
};

export default TopNavbar;
