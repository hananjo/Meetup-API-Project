import { useSelector, useDispatch, useStore } from "react-redux";
import { getAllGroups } from "../../store/group";
import { NavLink, useParams } from "react-router-dom";
import { useEffect } from "react";
import React from "react";
import { getAllEvents } from "../../store/event";

const GroupBrowser = () => {
  // const { groupId } = useParams();
  const dispatch = useDispatch();

  const groups = useSelector((state) => {
    return Object.values(state?.group);
  });

  const events = useSelector((state) => Object.values(state?.event));

  useEffect(() => {
    dispatch(getAllGroups());
    dispatch(getAllEvents());
  }, [dispatch]);

  return (
    <div>
      <div style={{ margin: "0 auto", width: "50%" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "0px",
            alignItems: "40%",
          }}
        >
          <NavLink
            to="/api/events"
            style={{
              marginRight: "20px",
              textDecoration: "none",
              color: "#666666",
            }}
            onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
            onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
          >
            {" "}
            <h2>Events</h2>
          </NavLink>

          <h2 style={{ color: "teal", textDecoration: "underline" }}>Groups</h2>
        </div>
        <h4
          style={{
            color: "lightgray",
            marginTop: "-5px",
          }}
        >
          Groups in Meetup
        </h4>
      </div>
      <div style={{ width: "50%", margin: "0 auto" }}>
        {groups?.map((group) => {
          return (
            // <div key={group.id}>
            <NavLink
              key={group.id}
              to={`/api/groups/${group.id}`}
              style={{ textDecoration: "none" }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  borderTop: "1px solid black",
                }}
              >
                <img
                  src={group.preview}
                  style={{
                    width: "200px",
                    // marginLeft: "400px",
                    marginRight: "30px",
                    marginBottom: "30px",
                    marginTop: "30px",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-around",
                  }}
                >
                  <h3
                    style={{
                      color: "black",
                      fontSize: "25px",
                      marginBottom: ".25%",
                    }}
                  >
                    {group.name}
                  </h3>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: "10px",
                      color: "#666666",
                    }}
                  >
                    {" "}
                    <p>{group.city}</p>
                    <p>{group.state}</p>
                  </div>
                  <p
                    style={{
                      color: "black",
                      marginTop: ".5px",
                      fontSize: "15px",
                    }}
                  >
                    {group.about}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: "10px",
                      marginRight: "20px",
                      color: "#666666",
                      marginBottom: "15%",
                    }}
                  >
                    <p>Number of Events: {group.numEvents} </p>
                    <p>&middot;</p>
                    {group.private ? <p>Private</p> : <p>Public</p>}
                  </div>
                </div>
              </div>{" "}
              {/* <h2 style={{ display: "flex", marginLeft: "400px" }}>
                _______________________________________________________
              </h2> */}
            </NavLink>

            // </div>
          );
        })}
      </div>
    </div>
  );
};

export default GroupBrowser;
