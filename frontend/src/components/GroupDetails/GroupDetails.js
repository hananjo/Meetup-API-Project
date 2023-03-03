import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getGroupDetails } from "../../store/group";
import DeleteGroupConfirmation from "../DeleteGroup/DeleteGroup";
import { deleteGroup } from "../../store/group";
import { NavLink } from "react-router-dom";
import { useRef } from "react";
import OpenModalButton from "../OpenModalButton";
import { useHistory } from "react-router-dom";

const GroupDetail = () => {
  // const user = useSelector((state) => state.session.user);
  // console.log(user)
  const history = useHistory();
  const dispatch = useDispatch();
  const { groupId } = useParams();

  const groups = useSelector((state) => {
    return state?.group.details;
  });

  useEffect(() => {
    dispatch(getGroupDetails(groupId));
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
    dispatch(deleteGroup(groupId));
    setShowMenu(false);
    history.push("/api/groups");
  };
  return (
    <div>
      <NavLink to="/api/groups"> Back to Groups List</NavLink>
      {groups && (
        <div>
          <h1>{groups.name}</h1>
          <img src={groups.preview} alt={groups.name} />
          <p>{groups.city}</p>
          <p>{groups.state}</p>
          <div>
            <p>{groups.numMembers} </p>
            &middot;
            {groups.private ? <p>Private</p> : <p>Public</p>}
          </div>
          <label>
            Organized by: {groups.Organizer.firstName}{" "}
            {groups.Organizer.lastName}
          </label>
          <div>
            <button
              onClick={() => alert("Feature coming soon")}
              style={{ backgroundColor: "red" }}
            >
              Join the Group
            </button>
          </div>
          <h2>What we're about</h2>
          <p>{groups.about}</p>
        </div>
      )}

      <div>
        <NavLink to={`/api/groups/${groupId}/events`}>
          <button>Create Event</button>
        </NavLink>
        <NavLink to={`/api/groups/${groupId}/update`}>
          <button>Update</button>
        </NavLink>
        <button onClick={openMenu}>Delete</button>
        {showMenu && (
          //   <OpenModalButton>
          <div className="delete-modal">
            <h3> Confirm Delete</h3>
            <p> Are you sure you want to remove this group?</p>
            <button className="delete-button" onClick={handleDelete}>
              Yes (Delete Group)
            </button>
            <button className="keep-button" onClick={closeMenu}>
              No (Keep Group)
            </button>
          </div>
          //   </OpenModalButton>
        )}
      </div>
    </div>
  );
};
export default GroupDetail;
