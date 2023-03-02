import { csrfFetch } from "./csrf";

const LOAD = "groups/LOAD";
const ADD_GROUP = "/groups/ADD_GROUP";
const LOAD_DETAILS = "/groups/LOAD_DETAILS";

const load = (list) => ({
  type: LOAD,
  list,
});

const loadDetails = (groupId) => ({
  type: LOAD_DETAILS,
  groupId,
});
const addGroup = (group) => ({
  type: ADD_GROUP,
  group,
});

export const getAllGroups = () => async (dispatch) => {
  const response = await fetch("/api/groups");
  console.log("*****", response);
  if (response.ok) {
    const list = await response.json();
    console.log("12345", list);
    dispatch(load(list.Groups));
  }
};

export const addNewGroup = (data) => async (dispatch) => {
  console.log(data);
  console.log("8974485");
  const response = await csrfFetch("/api/groups", {
    method: "POST",
    body: JSON.stringify(data),
  });
  const group = await response.json();
  //   console.log(group);
  dispatch(addGroup(group));
  return group;
};

// export const getGroupDetails = (groupId) => async (dispatch) => {
//   const response = await fetch(`/api/groups/${groupId}`);

//   if (response.ok) {
//     const group = await response.json();
//     console.log(group);
//     dispatch(addGroup(group));
//   }
// };

export const getGroupDetails = (groupId) => async (dispatch) => {
  // console.log(group);
  const response = await fetch(`/api/groups/${groupId}`);
  // console.log(response);
  if (response.ok) {
    const group = await response.json();
    console.log(group, "0000");
    dispatch(loadDetails(group));
  }
};
export const updateGroup = (groupId, data) => async (dispatch) => {
  console.log("hit");
  console.log(data, "^^^^^^^^^^^");
  const response = await csrfFetch(`/api/groups/${groupId}`, {
    method: "PUT",
    // headers: {
    //   "Content-Type": "application/json",
    // },
    body: JSON.stringify(data),
  });

  if (response.ok) {
    const group = await response.json();

    dispatch(addGroup(group));
    return group;
  }
};

const initialState = {};
const groupReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD:
      const newState = {};
      action.list.forEach((group) => {
        newState[group.id] = group;
      });
      return {
        ...newState,
      };
    case ADD_GROUP:
      return { ...state, [action.group.id]: action.group };
    case LOAD_DETAILS:
      return { ...state, details: action.groupId };
    default:
      return state;
  }
};

export default groupReducer;
