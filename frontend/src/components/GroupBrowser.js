import { useSelector, useDispatch } from "react-redux";
import { getAllGroups } from "../store/group";
import { NavLink, useParams } from "react-router-dom";
import { useEffect } from "react";
import React from "react";

const GroupBrowser = () => {
  const { groupId } = useParams();
  const dispatch = useDispatch();

  const groups = useSelector((state) => {
    return Object.values(state?.group);
    // console.log("*********", groups);
  });
  //   console.log("9999999", groups);

  useEffect(() => {
    dispatch(getAllGroups());
  }, [dispatch]);

  return (
    <div>
      <h1>Groups List</h1>
      {groups?.map((group) => {
        return (
          <div key={group.id}>
            <NavLink key={group.id} to={`/api/groups/${group.id}`}>
              <img src={group.preview} />
              {group.name}
            </NavLink>
            <p>{group.city}</p>
            <p>{group.state}</p>
            <p>{group.about}</p>
            <p>{group.numMembers}</p>
            {group.private ? <p>Private</p> : <p>Public</p>}
          </div>
        );
      })}
    </div>
  );
};

export default GroupBrowser;
