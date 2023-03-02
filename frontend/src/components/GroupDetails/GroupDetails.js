import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getGroupDetails } from "../../store/group";

import { NavLink } from "react-router-dom";

const GroupDetail = () => {
  // const user = useSelector((state) => state.session.user);
  // console.log(user)
  const dispatch = useDispatch();
  const { groupId } = useParams();

  const groups = useSelector((state) => {
    return state?.group.details;
  });
  console.log("2132", groups);

  useEffect(() => {
    dispatch(getGroupDetails(groupId));
  }, [dispatch]);

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
        <NavLink to={`/api/groups/${groupId}/update`}>
          <button>Update</button>
        </NavLink>

        <button>Delete</button>
      </div>
    </div>
  );
};
export default GroupDetail;
