import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { faBars } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const [showLogout, setShowLogout] = useState(false);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const name = localStorage.getItem("user_name");
    if (name) {
      setUserName(name);
    }
  }, []);

  const toggleLogout = () => {
    setShowLogout(!showLogout);
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_name");
    navigate("/");
  };

  return (
    <div className="flex justify-between bg-[#54ccb5] p-5 sm:p-11">
      <div className="name" onClick={toggleLogout}>
        <h2 className=" text-white text-[16px] sm:text-[20px]">
          {userName} <FontAwesomeIcon icon={faBars} className=" ml-2" />
        </h2>
        {showLogout && (
          <div
            className="logout mt-3 bg-white text-black p-2 cursor-pointer"
            onClick={handleLogout}
          >
            Logout
          </div>
        )}
      </div>
      <div className="wallet">
        <h2 className="text-white text-[16px] sm:text-[20px]">
          Wallet <FontAwesomeIcon icon={faChevronDown} />
        </h2>
      </div>
    </div>
  );
};

export default Navbar;
