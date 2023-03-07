import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getGroupDetails } from "../../store/group";
import { deleteGroup } from "../../store/group";
import { NavLink } from "react-router-dom";
import { useRef } from "react";
import OpenModalButton from "../OpenModalButton";
import { useHistory } from "react-router-dom";
import EventGroups from "../EventsForGroup/EventsForGroup";
import "./GroupDetails.css";

const GroupDetail = () => {
  const user = useSelector((state) => state.session.user);
  console.log(user);
  const history = useHistory();
  const dispatch = useDispatch();
  const { groupId } = useParams();

  const groups = useSelector((state) => {
    return state?.group.details;
  });
  console.log(groups);

  useEffect(() => {
    dispatch(getGroupDetails(groupId));
  }, [dispatch]);

  const [showMenu, setShowMenu] = useState(false);
  // const ulRef = useRef();

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
    dispatch(deleteGroup(groupId));
    setShowMenu(false);
    history.push("/api/groups");
  };
  return (
    <div>
      <div className="breadcrumb-group-link">
        &lt;
        <NavLink className="get-all-groups" to="/api/groups">
          {" "}
          Groups{" "}
        </NavLink>
      </div>

      {groups && (
        <div>
          <div className="top-container">
            <img
              src={groups.GroupImages[0].url}
              alt={groups.name}
              style={{ width: "400px", height: "350px" }}
            />
            <div className="top-right-container">
              <div className="top-four-items">
                <div className="group-detail-name">
                  <h1 style={{ marginBottom: "0px" }}>{groups.name}</h1>
                </div>
                <div className="three-middle-items">
                  <div className="location-group">
                    <p>{groups.city}</p>
                    <p>{groups.state}</p>
                  </div>

                  <div className="number-of-events-privacy">
                    <p>Number of Events: {groups.numMembers} </p>
                    <p>&middot;</p>
                    {groups.private ? <p>Private</p> : <p>Public</p>}
                  </div>
                  <div className="organizer-group-detail">
                    <p style={{ color: "#666666" }}>
                      Organized by: {groups.Organizer.firstName}{" "}
                      {groups.Organizer.lastName}
                    </p>
                  </div>
                </div>
              </div>
              <div></div>
              <div className="group-manage-buttons-container">
                {user && user.id !== groups.organizerId && (
                  <button
                    className="group-join-button"
                    onClick={() => alert("Feature coming soon")}
                    // style={{
                    //   backgroundColor: "#D0312D",
                    //   width: "160px",
                    //   height: "40px",
                    //   color: "white",
                    //   fontWeight: "bold",
                    //   boxShadow: "3px 3px 5px #000000",
                    //   border: "1px solid black",
                    // }}
                  >
                    Join the Group
                  </button>
                )}
                {user && groups && user.id === groups.organizerId ? (
                  <div>
                    <div className="manage-group-container">
                      <NavLink to={`/api/groups/${groupId}/events`}>
                        <button className="manage-buttons">Create Event</button>
                      </NavLink>
                      <NavLink to={`/api/groups/${groupId}/update`}>
                        <button className="manage-buttons">Update</button>
                      </NavLink>
                      <button className="manage-buttons" onClick={openMenu}>
                        Delete
                      </button>
                    </div>
                    {showMenu && (
                      //   <OpenModalButton>
                      <div className="delete-modal">
                        <h3> Confirm Delete</h3>
                        <p> Are you sure you want to remove this group?</p>
                        <button
                          className="delete-button"
                          onClick={handleDelete}
                        >
                          Yes (Delete Group)
                        </button>
                        <button className="keep-button" onClick={closeMenu}>
                          No (Keep Group)
                        </button>
                      </div>
                      //   </OpenModalButton>
                    )}
                  </div>
                ) : (
                  <br />
                )}
              </div>
            </div>
          </div>

          <div className="group-bottom-container">
            <h2 className="organizer-title">Organizer </h2>
            <div className="organizer-values">
              <p>{groups.Organizer.firstName}</p>
              <p>{groups.Organizer.lastName}</p>
            </div>
            <div className="about-groups-title">
              <h2>What we're about</h2>
            </div>
            <div className="about-groups">
              <p>{groups.about}</p>
            </div>
          </div>
        </div>
      )}

      <div className="events-bottom-container">
        <EventGroups />
      </div>
    </div>
  );
};
export default GroupDetail;
