import { getEventsForGroup } from "../../store/event";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
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

  return (
    <div className="event-groups-container">
      <h2>Events ({events.length})</h2>
      <div className="events-for-group-box">
        {events.map((event) => (
          <div className="events-for-group-container">
            <img
              src={event.preview}
              alt={event.name}
              style={{ width: "150pxpx", height: "180px" }}
            />
            <div className="events-for-group-info">
              <div className="events-for-group-startDate">
                <p>{event.startDate}</p>
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
        ))}
      </div>
    </div>
  );
};

export default EventGroups;
