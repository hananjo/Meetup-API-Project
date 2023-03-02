import { useSelector, useDispatch } from "react-redux";
import { getAllEvents } from "../../store/event";
import { NavLink, useParams } from "react-router-dom";
import { useEffect } from "react";
import React from "react";

const EventBrowser = () => {
  const { eventId } = useParams();
  const dispatch = useDispatch();

  const events = useSelector((state) => {
    return Object.values(state?.event);
  });

  useEffect(() => {
    dispatch(getAllEvents());
  }, [dispatch]);

  return (
    <div>
      <h2>Events</h2>
      <h2>Groups</h2>
      <p>Events in Meetup</p>
      {events?.map((event) => {
        return (
          <div key={event.id}>
            <NavLink key={event.id} to={`/api/events/${event.id}`}>
              {/* <img src={event.preview} /> */}
              {event.name}
            </NavLink>
            <p>{event.description}</p>
            <p>Price: ${event.price}</p>
            <p>Capacity: {event.capacity}</p>
            <p>{event.type}</p>
          </div>
        );
      })}
    </div>
  );
};

export default EventBrowser;
