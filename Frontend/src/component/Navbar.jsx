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
        <section className="hero">
          <h2>Welcome to the House Details Form</h2>
          <p>Fill out the form to submit your house details.</p>
          <button className="get-started-btn">Get Started</button>
        </section>

      </main>
    </div>
  );
};

export default Navbar;
