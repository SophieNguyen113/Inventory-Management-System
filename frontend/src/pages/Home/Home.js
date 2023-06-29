import React from "react";
import { FaCloudversify } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./Home.scss";
import heroImg from "../../assets/inv-img1.png";
import { ShowOnLogin, ShowOnLogout } from "../../components/protect/HiddenLink";

const Home = () => {
  return (
    <div className="home">
      <nav className="container --flex-between ">
        <div className="logo">
          <FaCloudversify size={80} />
        </div>

        <ul className="home-links">
          <ShowOnLogout>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </ShowOnLogout>
          <ShowOnLogout>
            <li>
              <button className="--btn --btn-primary">
                <Link to="/login">Login</Link>
              </button>
            </li>
          </ShowOnLogout>
          <ShowOnLogin>
            <li>
              <button className="--btn --btn-primary">
                <Link to="/dashboard">Dashboard</Link>
              </button>
            </li>
          </ShowOnLogin>
        </ul>
      </nav>
      <section className="container hero">
        <div className="hero-text">
          <h2>Inventory Management System</h2>
          <p>
          The Inventory Management System is a cutting-edge solution designed to streamline 
          and optimize product control and management within a warehouse.
          </p>
          
          <div className="--flex-start">
            <NumberText num="24K" text="Brand Owners" />
            <NumberText num="17K" text="Active Users" />
            <NumberText num="250+" text="Partners" />
          </div>
        </div>

        <div className="hero-image">
          <img src={heroImg} alt="Inventory" />
        </div>
      </section>
    </div>
  );
};

const NumberText = ({ num, text }) => {
  return (
    <div className="--mr">
      <h3 className="--color-white">{num}</h3>
      <p className="--color-white">{text}</p>
    </div>
  );
};

export default Home;
