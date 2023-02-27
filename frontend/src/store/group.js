import { csrfFetch } from "./csrf";

const LOAD = "group/LOAD";

const load = (list) => ({
  type: LOAD,
  list,
});

export const getAllGroups = () => async (dispatch) => {
  const response = await csrfFetch("/api/groups");
  console.log("*****", response);
  if (response.ok) {
    const list = await response.json();
    dispatch(load(list));
  }
};

const initialState = {
  groups: {},
};
const groupReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD:
      const newState = {};
      action.list.forEach((group) => {
        newState[group.id] = group;
      });
      return {
        ...state,
        ...newState,
      };
    default:
      return state;
  }
};

export default groupReducer;
