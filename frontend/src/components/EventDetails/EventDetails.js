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
import "./EventDetails.css";

const EventDetail = () => {
  const user = useSelector((state) => state.session.user);
  // console.log(user)
  const history = useHistory();
  const dispatch = useDispatch();
  const { eventId } = useParams();

  const group = useSelector((state) => state?.groups);
  const events = useSelector((state) => {
    return state?.event.details;
  });
  console.log(events, "events%%%%%");
  const groups = useSelector((state) => {
    return state?.group.details;
  });
  console.log(groups, "group%%%%%%");
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
    <div className="event-detail-container">
      {events && (
        <div>
          <div className="breadcrumb-event-link">
            <p>
              &lt;{" "}
              <NavLink style={{ color: "teal" }} to="/api/events">
                {" "}
                Events
              </NavLink>
            </p>
          </div>
          <div className="event-detail-title">
            <h1>{events.name}</h1>
          </div>

          {/* {events.EventImages && ( */}
          <div className="top-event-container">
            <img
              style={{ width: "400px", height: "350px" }}
              src={events?.EventImages[0]?.url}
              alt={events.name}
            />
            {/* )} */}
            <div className="group-and-event-info-box">
              <div className="group-info-box">
                {/* <img src={group[1].preview}></img> */}
                <p className="group-name-events">{events.Group.name}</p>
                {events.Group.private ? <p>Private</p> : <p>Public</p>}
              </div>

              <div className="event-info-box">
                <div className="event-time">
                  <i className="f-regular fa-clock"></i>

                  <p>
                    {new Date(events.startDate).toDateString().split(" ")[3]}
                    {" / "}
                    {new Date(events.startDate).toDateString().split(" ")[1]}
                    {" / "}
                    {new Date(events.startDate).toDateString().split(" ")[2]}
                    {new Date(events.startDate).toDateString().split(" ")[4]}
                    {"   "}
                    &middot;
                    {"    "}
                  </p>
                  <p>
                    {new Date(events.endDate).toDateString().split(" ")[3]}
                    {" / "}
                    {new Date(events.endDate).toDateString().split(" ")[1]}
                    {" / "}
                    {new Date(events.endDate).toDateString().split(" ")[2]}
                    {new Date(events.endDate).toDateString().split(" ")[4]}
                    {"   "}
                    &middot;
                    {"    "}
                  </p>
                </div>
                <i class="fas-solid fas-dollar-sign"></i>
                <p>{events.price}</p>
                <i class="fas-solid fas-map-pin"></i> <p>{events.type}</p>
              </div>
            </div>
          </div>
          <h2>Description:</h2>
          <p>{events.description}</p>
        </div>
      )}
      {group && group[events[eventId].groupId].organizerId === user.id ? (
        <div>
          <button onClick={openMenu}>Delete</button>
          {showMenu && (
            <div className="delete-modal">
              <div className="delete-title">
                <h3> Confirm Delete</h3>
              </div>
              <div className="delete-question">
                <p> Are you sure you want to remove this event?</p>
              </div>
              <div className="confirmation-delete-buttons">
                <button className="delete-button" onClick={handleDelete}>
                  Yes (Delete Event)
                </button>
                <button className="keep-button" onClick={closeMenu}>
                  No (Keep Event)
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <br />
      )}
    </div>
  );
};
export default EventDetail;
