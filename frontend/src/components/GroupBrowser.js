import { useSelector, useDispatch } from "react-redux";
import { getAllGroups } from "../store/group";
// import { NavLink, useParams } from "react-router-dom";
import { useEffect } from "react";
import React from "react";

const GroupBrowser = () => {
  //   const { groupId } = useParams();
  const dispatch = useDispatch();

  const groups = useSelector((state) => {
    // console.log("*********", groups);
    return state.group.list.map((groupId) => state.group[groupId]);
  });

  useEffect(() => {
    dispatch(getAllGroups(groups));
  }, [dispatch]);

  return (
    <div>
      <h1>Groups List</h1>
      <ol>
        {groups.map((group) => {
          return <li key={group.id}>{group.name}</li>;
        })}
      </ol>
    </div>
  );
};

export default GroupBrowser;
