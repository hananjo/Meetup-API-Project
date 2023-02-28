const LOAD = "groups/LOAD";

const load = (list) => ({
  type: LOAD,
  list,
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
    default:
      return state;
  }
};

export default groupReducer;
