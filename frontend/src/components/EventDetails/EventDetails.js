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
  const history = useHistory();
  const dispatch = useDispatch();
  const { eventId } = useParams();

  const group = useSelector((state) => state?.group);

  const events = useSelector((state) => {
    return state?.event.details;
  });

  const groups = useSelector((state) => {
    return state?.group.details;
  });


  useEffect(() => {
    dispatch(getEventDetails(eventId));
    dispatch(getGroupDetails(eventId));
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
                <img
                  style={{ width: "100px" }}
                  src={groups?.GroupImages[0].url}
                ></img>
                <div className="event-detail-group-info-box">
                  <p className="group-name-events">{events.Group.name}</p>
                  {events.Group.private ? <p>Private</p> : <p>Public</p>}
                </div>
              </div>

              <div className="event-info-box">
                <div className="event-time">
                  <i
                    style={{ color: "lightgray", fontSize: "30px" }}
                    className="fas f-regular fa-clock"
                  >
                    <div className="start-end">
                      <p>START</p>
                      <div className="end">
                        <p>END</p>
                      </div>
                    </div>
                  </i>
                  <div className="start-end-time">
                    <p>
                      {new Date(events.startDate).toDateString().split(" ")[3]}
                      {" / "}
                      {new Date(events.startDate).toDateString().split(" ")[1]}
                      {" / "}
                      {new Date(events.startDate).toDateString().split(" ")[2]}
                      {"   "}
                      &middot;
                      {"    "}
                      {new Date(events.startDate).toString().split(" ")[4]}
                    </p>

                    <p>
                      {new Date(events.endDate).toDateString().split(" ")[3]}
                      {" / "}
                      {new Date(events.endDate).toDateString().split(" ")[1]}
                      {" / "}
                      {new Date(events.endDate).toString().split(" ")[2]}
                      {"  "} &middot;
                      {"  "}
                      {new Date(events.endDate).toString().split(" ")[4]}
                    </p>
                  </div>
                </div>
                <div className="price-icon">
                  {" "}
                  <i
                    style={{ color: "lightgray", fontSize: "30px" }}
                    className="fas fa-dollar-sign"
                  ></i>{" "}
                  <div className="event-detail-price">{events.price}</div>
                </div>
                <p>
                  <div className="pin-needle-icon">
                    <i
                      style={{ color: "lightgray", fontSize: "30px" }}
                      className="fas fa-map-pin"
                    ></i>
                    <div className="event-detail-type">{events.type}</div>
                  </div>
                </p>
                {group && group[events?.groupId]?.organizerId === user?.id ? (
                  <div className="event-detail-delete-container">
                    <button
                      className="event-detail-delete-button"
                      onClick={openMenu}
                    >
                      Delete
                    </button>
                  </div>
                ) : (
                  <br />
                )}
                {/* <div> */}
                <div className="modal-container">
                  {showMenu && (
                    <div className="delete-event-modal">
                      <div className="delete-title">
                        <h3> Confirm Delete</h3>
                      </div>
                      <div className="delete-question">
                        <p> Are you sure you want to remove this event?</p>
                      </div>
                      <div className="confirmation-delete-buttons">
                        <button
                          className="delete-button"
                          onClick={handleDelete}
                        >
                          Yes (Delete Event)
                        </button>
                        <button className="keep-button" onClick={closeMenu}>
                          No (Keep Event)
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                {/*  */}
              </div>
            </div>
          </div>
          <h2>Description:</h2>
          <p>{events.description}</p>
        </div>
      )}

      {/* {group && group[events[eventId].groupId].organizerId === user.id ? ( */}

      {/* ) : (
        <br />
      )} */}
    </div>
  );
};
export default EventDetail;
