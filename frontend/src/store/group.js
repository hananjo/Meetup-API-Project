import { csrfFetch } from "./csrf";

const LOAD = "/groups/LOAD";
const ADD_GROUP = "/groups/ADD_GROUP";
const LOAD_DETAILS = "/groups/LOAD_DETAILS";
const REMOVE_GROUP = "/groups/REMOVE_GROUP";

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

const removeGroup = (group) => ({
  type: REMOVE_GROUP,
  group,
});

export const getAllGroups = () => async (dispatch) => {
  const response = await fetch("/api/groups");
  if (response.ok) {
    const list = await response.json();
    dispatch(load(list.Groups));
  }
};

export const addNewGroup = (data) => async (dispatch) => {
  const { preview } = data;
  let response = await csrfFetch("/api/groups", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (response.ok) {
    response = await response.json();
    const imgObj = {
      url: preview,
      groupId: response.id,
      preview: true,
    };
    const fetchImage = await csrfFetch(`/api/groups/${response.id}/images`, {
      method: "POST",
      body: JSON.stringify(imgObj),
    });
    dispatch(addGroup(response));
  }

  return response;
};

export const getGroupDetails = (groupId) => async (dispatch) => {
  const response = await fetch(`/api/groups/${groupId}`);
  if (response.ok) {
    const group = await response.json();

    dispatch(loadDetails(group));
  }
};
export const updateGroup = (groupId, data) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${groupId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  if (response.ok) {
    const group = await response.json();
    dispatch(addGroup(group));
    return group;
  }
};

export const deleteGroup = (groupId) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${groupId}`, {
    method: "DELETE",
  });
  if (response.ok) {
    const group = await response.json();
    dispatch(removeGroup(group));
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
    case REMOVE_GROUP:
      const deleteNewState = { ...state };
     
      delete deleteNewState.group[action.group.id];

      return deleteNewState;
    default:
      return state;
  }
};

export default groupReducer;
