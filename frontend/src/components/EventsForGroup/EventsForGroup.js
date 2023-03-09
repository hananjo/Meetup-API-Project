import { getEventsForGroup } from "../../store/event";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import "../GroupDetails/GroupDetails.css";
const EventGroups = () => {
  const { groupId } = useParams();
  const dispatch = useDispatch();
  const events = useSelector((state) => {
    return Object.values(state?.event);
  });

  useEffect(() => {
    dispatch(getEventsForGroup(groupId));
  }, [dispatch]);

  // const now = new Date();
  // console.log(now, "now");
  // const upComingEvents = events.filter(
  //   (event) => new Date(event.startDate) > now
  // );
  // const pastEvents = events.filter((event) => new Date(event.startDate <= now));
  // upComingEvents.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  // console.log(upComingEvents, "up");
  // pastEvents.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
  // console.log(pastEvents, "past");
  return (
    <div className="event-groups-container">
      <h2 className="events-group-title">Events ({events.length})</h2>
      {events.map((event) => (
        <NavLink
          className="navlink-events-groups"
          to={`/api/events/${event.id}`}
        >
          <div className="events-for-group-box">
            <div className="events-for-group-container">
              <img
                src={event.preview}
                alt={event.name}
                style={{ width: "150pxpx", height: "180px" }}
              />
              <div className="events-for-group-info">
                <div className="events-for-group-startDate">
                  <p>
                    {new Date(event.startDate).toDateString().split(" ")[3]}
                    {" / "}
                    {new Date(event.startDate).toDateString().split(" ")[1]}
                    {" / "}
                    {new Date(event.startDate).toDateString().split(" ")[2]}
                    {new Date(event.startDate).toDateString().split(" ")[4]}
                    {"   "}
                    &middot;
                    {"    "}
                    {/* {new Date(event.startDate).toDateString().split(" ")[]} */}
                  </p>
                </div>
                <div className="events-for-group-name">
                  <h3>{event.name}</h3>
                </div>
                <div className="location-event">
                  <p>{event.Group.city}</p>
                  <p>{event.Group.state}</p>
                </div>
                <div>
                  <p>{event.description}</p>
                </div>
              </div>
            </div>
          </div>
        </NavLink>
      ))}{" "}
    </div>
  );
};

export default EventGroups;
