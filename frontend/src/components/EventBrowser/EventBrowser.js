import { useSelector, useDispatch } from "react-redux";
import { getAllEvents } from "../../store/event";
import { NavLink, useParams } from "react-router-dom";
import { useEffect } from "react";
import React from "react";
import "./EventBrowser.css";
const EventBrowser = () => {
  const { eventId } = useParams();
  const dispatch = useDispatch();

  const events = useSelector((state) => {
    return Object.values(state?.event);
  });
  // console.log(events, "%%%%%%%");
  useEffect(() => {
    dispatch(getAllEvents());
  }, [dispatch]);

  const now = new Date();

  const upComingEvents = events.filter(
    (event) => new Date(event.startDate) >= now
  );
  const pastEvents = events.filter((event) => new Date(event.startDate) < now);
  upComingEvents.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

  pastEvents.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

  return (
    <div>
      <div className="get-all-nav">
        <div className="events-groups-navlink">
          <div className="event-same-page">
            <h2>Events</h2>
          </div>

          <NavLink
            to="/groups"
            style={{ color: "#666666" }}
            onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
            onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
          >
            {" "}
            <h2>Groups</h2>
          </NavLink>
        </div>
        <div className="subtitle-nav-events">
          <p>Events in Meetup</p>
        </div>
      </div>
      <div className="get-all-top-container">
        {upComingEvents?.map((event) => {
          return (
            <div key={event.id}>
              <NavLink
                // key={event.id}
                to={`/api/events/${event.id}`}
                style={{ textDecoration: "none" }}
              >
                <div className="get-all-listings">
                  <div className="get-all-img">
                    <img src={event.preview} style={{ width: "200px" }} />
                  </div>
                  <div className="listing-info">
                    <div className="startDate">
                      <p>
                        {new Date(event.startDate).toString().split(" ")[3]}
                        {" / "}
                        {new Date(event.startDate).toString().split(" ")[1]}
                        {" / "}
                        {new Date(event.startDate).toString().split(" ")[2]}
                        {"   "}
                        &middot;
                        {"    "}
                        {new Date(event.startDate).toString().split(" ")[4]}
                      </p>
                    </div>
                    <div className="listing-name">
                      <h2>{event.name}</h2>
                    </div>
                    <div className="event-price">
                      <p>Price: ${event.price}</p>
                    </div>
                    <div className="event-capacity">
                      <p>Capacity: {event.capacity}</p>
                    </div>
                    <div className="event-type">
                      <p>{event.type}</p>{" "}
                    </div>
                    <div className="event-location">
                      {" "}
                      {event && event.Group && <p>{event?.Group.state}</p>}
                    </div>
                  </div>
                </div>
                <div className="event-description">
                  {" "}
                  <p>{event.description}</p>
                </div>
              </NavLink>
            </div>
          );
        })}
      </div>
      <div className="get-all-top-container">
        {pastEvents?.map((event) => {
          return (
            <div key={index}>
              <NavLink
                // key={event.id}
                to={`/events/${event.id}`}
                style={{ textDecoration: "none" }}
              >
                <div className="get-all-listings">
                  <div className="get-all-img">
                    <img src={event.preview} style={{ width: "200px" }} />
                  </div>
                  <div className="listing-info">
                    <div className="startDate">
                      <p>
                        {new Date(event.startDate).toString().split(" ")[3]}
                        {" / "}
                        {new Date(event.startDate).toString().split(" ")[1]}
                        {" / "}
                        {new Date(event.startDate).toString().split(" ")[2]}
                        {"   "}
                        &middot;
                        {"    "}
                        {new Date(event.startDate).toString().split(" ")[4]}
                      </p>
                    </div>
                    <div className="listing-name">
                      <h2>{event.name}</h2>
                    </div>
                    <div className="event-price">
                      <p>Price: ${event.price}</p>
                    </div>
                    <div className="event-capacity">
                      <p>Capacity: {event.capacity}</p>
                    </div>
                    <div className="event-type">
                      <p>{event.type}</p>{" "}
                    </div>
                    <div className="event-location">
                      {" "}
                      {event && event.Group && <p>{event?.Group.state}</p>}
                    </div>
                  </div>
                </div>
                <div className="event-description">
                  {" "}
                  <p>{event.description}</p>
                </div>
              </NavLink>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EventBrowser;
