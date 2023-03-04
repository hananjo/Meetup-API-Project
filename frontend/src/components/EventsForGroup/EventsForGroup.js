import { getEventsForGroup } from "../../store/event";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
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
    <div>
      <h2>Events {events.length}</h2>
      <ul>
        {events.map((event) => (
          <li key={event.id}>
            <img src={event.preview} alt={event.name} />
            <div>
              <h3>{event.title}</h3>
              <p>{event.Group.city}</p>
              <p>{event.Group.state}</p>
              <p>{event.description}</p>
              <p></p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventGroups;
