import React from "react";
import "./LandingPage.css";
import { NavLink, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
// import { useHistory } from "react-router-dom";
import SignupFormModal from "../SignupFormModal";
const LandingPage = () => {
  const user = useSelector((state) => state.session.user);

  // function openSignUpModal() {
  //   setShowModal(true);
  // }
  // console.log("******123", user);
  const history = useHistory();
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const handleSubmit = () => {
    dispatch(SignupFormModal());
    setShowMenu(false);
    // history.push(`/`);
  };

  return (
    <div className="container">
      <section className="section1">
        <div className="title-info">
          <h1 style={{ fontSize: "40px" }}>
            Welcome to Meetup! Here you'll find like-minded friends with common
            interests{" "}
          </h1>
          <p style={{ fontSize: "30px" }}>Join a group, meet a friend!</p>
        </div>
        <div className="infographic">
          <img
            src="https://res.cloudinary.com/dwphwqyrn/image/upload/v1677549284/Project%20Schema/Screen_Shot_2023-02-27_at_5.47.16_PM_vmztld.png"
            alt="inforgraphic"
            width="800"
          />
        </div>
      </section>
      <section className="section2">
        <div className="subTitle-info">
          <h2 style={{ fontSize: "25px", textAlign: "center" }}>
            How it works
          </h2>
          <p style={{ fontSize: "20px", textAlign: "center" }}>
            Meet your people, discover yourself, enjoy your life!
          </p>
        </div>
      </section>
      {/* <section className="section3"> */}
      {/* <div className="column"> */}
      <div
        className="bottom-landing-page-container"
        // style={{
        //   display: "flex",
        //   justifyContent: "center",
        //   gap: "15px",
        //   // justifyContent: "space-evenly",
        // }}
      >
        <NavLink
          to="/api/groups"
          // className="navlink-see-all-groups"
          style={{
            color: "teal",
            textAlign: "center",
            textDecoration: "none",
            cursor: "pointer",
            fontSize: "20px",
          }}
          // onMouseOver={(e) => (e.target.style.textDecoration = "underline")}
          onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
          onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
        >
          <img
            src="https://res.cloudinary.com/dwphwqyrn/image/upload/v1677548492/Project%20Schema/groups_igjkqj.jpg"
            alt="Meetup Pic"
            width="180"
            height="150"
          />
          <p>See all groups</p>
        </NavLink>
        {/* </div> */}
        {/* <div className="column"> */}
        <NavLink
          to="/api/events"
          // className="navlink-see-all-events"
          style={{
            color: "teal",
            textAlign: "center",
            textDecoration: "none",
            cursor: "pointer",
            fontSize: "20px",
          }}
          onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
          onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
        >
          <img
            src="https://res.cloudinary.com/dwphwqyrn/image/upload/v1677549283/Project%20Schema/33-339853_calendar-invite-cartoon_xoat94.png"
            alt="Find Event"
            width="230"
            height="150"
          />
          <p>Find an event</p>
        </NavLink>
        {/* </div> */}
        {/* <div className="column"> */}
        {user ? (
          <NavLink
            to="/api/groups/new"
            // className={user ? "not-disabled" : "disabled"}
            // className="navlink-create-new-group"
            style={{
              color: "teal",
              textAlign: "center",
              textDecoration: "none",
              cursor: "pointer",
              fontSize: "20px",
            }}
            onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
            onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
          >
            <img
              src="https://res.cloudinary.com/dwphwqyrn/image/upload/v1677549283/Project%20Schema/crowd-clipart-event-13_ocahsp.png"
              alt="Create-Event"
              width="230"
            />
            <p>Start a new group</p>
          </NavLink>
        ) : (
          <br />
        )}
        {/* </div> */}
      </div>
      {/* </section> */}
      <section className="section4">
        <div
          className="join-group-button-landing"
          style={{ display: "flex", justifyContent: "center" }}
          ref={ulRef}
        >
          <div>
            <button
              style={{
                backgroundColor: "teal",
                borderRadius: "0px",
                padding: "10px 22px",
                fontSize: "15px",
                fontWeight: "bold",
                color: "white",
                fontFamily: "Helvetica, sans-serif",
                boxShadow: "2px 2px 0px 0px #000",
                borderColor: "5px #000",
                marginBottom: "20px",
              }}
              onClick={openMenu}
            >
              Join Meetup
            </button>
            <div className="landing-page-join-signup">
              {showMenu && <SignupFormModal closeMenu={handleSubmit} />}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
