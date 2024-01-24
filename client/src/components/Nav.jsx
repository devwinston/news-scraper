import React from "react";
import { useNavigate, NavLink } from "react-router-dom";

import Logo from "../assets/images/logo.png";
import Menu from "../assets/images/menu.png";
import Close from "../assets/images/close.png";

const Nav = ({ menu, setMenu }) => {
  const navigate = useNavigate();

  return (
    <div className="nav">
      <img
        src={Logo}
        alt="logo"
        className="logo"
        onClick={() => navigate("/singapore")}
      />

      <img
        src={menu ? Close : Menu}
        alt="menu"
        className="mobile-menu"
        onClick={() => {
          setMenu((prev) => !prev);
          document.body.style.overflow = menu ? "visible" : "hidden";
        }}
      />

      <div className="links" style={{ right: menu ? "0" : "-500px" }}>
        <NavLink to="/singapore">Singapore</NavLink>
        <NavLink to="/asia">Asia</NavLink>
        <NavLink to="/world">World</NavLink>
        <NavLink to="/business">Business</NavLink>
        <NavLink to="/sport">Sport</NavLink>
      </div>
    </div>
  );
};

export default Nav;
