import { csrfFetch } from "./csrf";

const LOAD = "groups/LOAD";
const ADD_GROUP = "/groups/ADD_GROUP";
const LOAD_DETAILS = "/groups/LOAD_DETAILS";

const load = (list) => ({
  type: LOAD,
  list,
});

// const loadDetails = (details) => {
//   type: LOAD_DETAILS;
//   details;
// };
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

// export const getGroupDetails = (group) => async dispatch {};
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

const initialState = {
  groups: [],
};
const groupReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD:
      const newState = {};
      action.list.forEach((group) => {
        newState[group.id] = group;
      });
      return {
        // ...state,
        ...newState,
      };
    case ADD_GROUP:
      return { ...state, [action.group.id]: action.group };
    default:
      return state;
  }
};

export default groupReducer;
