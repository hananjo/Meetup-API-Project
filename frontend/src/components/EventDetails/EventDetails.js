import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getEventDetails } from "../../store/event";
import { getGroupDetails } from "../../store/group";
import { NavLink } from "react-router-dom";
import { useRef } from "react";
import { deleteEvent } from "../../store/event";
// import OpenModalButton from "../OpenModalButton";
import { useHistory } from "react-router-dom";

const EventDetail = () => {
  // const user = useSelector((state) => state.session.user);
  // console.log(user)
  const history = useHistory();
  const dispatch = useDispatch();
  const { eventId } = useParams();

  const events = useSelector((state) => {
    return state?.event.details;
  });
  //   const groups = useSelector((state) => {
  //     return state?.group.details;
  //   });
  useEffect(() => {
    dispatch(getEventDetails(eventId));
  }, [dispatch]);

  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      //   if (!ulRef.current.contains(e.target)) {
      setShowMenu(false);
      //   }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const handleDelete = () => {
    dispatch(deleteEvent(eventId));
    setShowMenu(false);
    history.push(`/api/groups/${events.Group.id}`);
  };
  return (
    <div>
      <p>
        &lt;
        <NavLink to="/api/events"> Events</NavLink>
      </p>
      {events && (
        <div>
          <h1>{events.name}</h1>
          <h2>Hosted by:</h2>
          <img src={events.preview} alt={events.name} />
          <h2>Description:</h2>
          <p>{events.description}</p>

          <div className="event-info-box">
            <p>{events.startDate}</p>
            <p>{events.endDate}</p>
            <p>{events.price}</p>
            <p>{events.preview}</p>
          </div>
          <div className="group-info-box">
            <p>{events.Group.name}</p>
            {events.Group.private ? <p>Private</p> : <p>Public</p>}
          </div>
        </div>
      )}

      <div>
        <button onClick={openMenu}>Delete</button>
        {showMenu && (
          <div className="delete-modal">
            <h3> Confirm Delete</h3>
            <p> Are you sure you want to remove this event?</p>
            <button className="delete-button" onClick={handleDelete}>
              Yes (Delete Event)
            </button>
            <button className="keep-button" onClick={closeMenu}>
              No (Keep Event)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default EventDetail;
