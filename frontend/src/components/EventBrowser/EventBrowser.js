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
  console.log(events, "%%%%%%%");
  useEffect(() => {
    dispatch(getAllEvents());
  }, [dispatch]);

  return (
    <div>
      <div className="get-all-nav">
        <div className="events-groups-navlink">
          <div className="event-same-page">
            <h2>Events</h2>
          </div>

          <NavLink
            to="/api/groups"
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
        {events?.map((event) => {
          return (
            <div key={event.id}>
              <NavLink
                key={event.id}
                to={`/api/events/${event.id}`}
                style={{ textDecoration: "none" }}
              >
                <div className="get-all-listings">
                  <div className="get-all-img">
                    <img src={event.preview} style={{ width: "200px" }} />
                  </div>
                  <div className="listing-info">
                    <div className="listing-name">
                      <h2>{event.name}</h2>
                    </div>
                    <p>{event.description}</p>
                    <p>Price: ${event.price}</p>
                    <p>Capacity: {event.capacity}</p>
                    <p>{event.type}</p>{" "}
                  </div>
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
