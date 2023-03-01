import React from "react";

import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
const LandingPage = () => {
  const user = useSelector((state) => state.session.user);
  console.log("******123", user);
  return (
    <>
      <section className="section1">
        <div className="title-info">
          <h1>
            Welcome to Meetup! Here you'll find like-minded friends with common
            interests{" "}
          </h1>
          <p>Join a group, meet a friend!</p>
        </div>
        <div className="infographic">
          <img
            src="https://res.cloudinary.com/dwphwqyrn/image/upload/v1677549284/Project%20Schema/Screen_Shot_2023-02-27_at_5.47.16_PM_vmztld.png"
            alt="inforgraphic"
          />
        </div>
      </section>
      <section className="section2">
        <div className="subTitle-info">
          <h2>How it works</h2>
          <p>Meet your people, discover yourself, enjoy your life!</p>
        </div>
      </section>
      <section className="section3">
        <div className="group-column">
          <NavLink to="/api/groups">
            <img
              src="https://res.cloudinary.com/dwphwqyrn/image/upload/v1677548492/Project%20Schema/groups_igjkqj.jpg"
              alt="Meetup Pic"
            />
            <p>See all groups</p>
          </NavLink>
        </div>
        <div className="event-column">
          <NavLink to="/api/events">
            <img
              src="https://res.cloudinary.com/dwphwqyrn/image/upload/v1677549283/Project%20Schema/33-339853_calendar-invite-cartoon_xoat94.png"
              alt="Find Event"
            />
            <p>Find an event</p>
          </NavLink>
        </div>
        <div className="create-group-column">
          <NavLink
            to="/api/groups/new"
            className={user ? "not-disabled" : "disabled"}
          >
            <img
              src="https://res.cloudinary.com/dwphwqyrn/image/upload/v1677549283/Project%20Schema/crowd-clipart-event-13_ocahsp.png"
              alt="Create-Event"
            />
            <p>Start a new group</p>
          </NavLink>
        </div>
      </section>
      <section className="section4">
        <button>Join Meetup</button>
      </section>
    </>
  );
};

export default LandingPage;
