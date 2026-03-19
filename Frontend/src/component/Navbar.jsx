import React from "react";

const Navbar = () => {
  return (
    <div>
      <header>
        <div>
          <img src="/assets/logo.png" alt="logo" className="logo" />
          <h1>House Details Form</h1>
        </div>
        <nav>
          <ul>
            <li>
              <NavLink to="/">Home</NavLink>
            </li>
            <li>
              <NavLink to="/about">About</NavLink>
            </li>
            <li>
              <NavLink to="/contact">Contact</NavLink>
            </li>
            <li>
              <NavLink to="/form">Form</NavLink>
            </li>
          </ul>
        </nav>
        <button className="login-btn">Login</button>
        <button className="signup-btn">Sign Up</button>
      </header>
      <main>
        
      </main>
    </div>
  );
};

export default Navbar;
