import { csrfFetch } from "./csrf";

const LOAD = "/events/LOAD";
const LOAD_DETAILS = "/events/LOAD_DETAILS";
const ADD_EVENT = "/events/ADD_EVENT";
const REMOVE_EVENT = "/events/REMOVE_EVENT";

const load = (list) => ({
  type: LOAD,
  list,
});

const loadDetails = (eventId) => ({
  type: LOAD_DETAILS,
  eventId,
});

const addEvent = (event) => ({
  type: ADD_EVENT,
  event,
});
const removeEvent = (event) => ({
  type: REMOVE_EVENT,
  event,
});

export const getAllEvents = () => async (dispatch) => {
  const response = await fetch("/api/events");

  if (response.ok) {
    const list = await response.json();

    dispatch(load(list.Events));
  }
};

export const getEventsForGroup = (groupId) => async (dispatch) => {
  const response = await fetch(`/api/groups/${groupId}/events`);
  if (response.ok) {
    const list = await response.json();

    dispatch(load(list.Events));
  }
};
export const getEventDetails = (eventId) => async (dispatch) => {
  const response = await fetch(`/api/events/${eventId}`);
  if (response.ok) {
    const event = await response.json();

    dispatch(loadDetails(event));
  }
};

export const addNewEvent = (groupId, data) => async (dispatch) => {

  const response = await csrfFetch(`/api/groups/${groupId}/events`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  const event = await response.json();
  dispatch(addEvent(event));
  return event;
};
export const deleteEvent = (eventId) => async (dispatch) => {
  const response = await csrfFetch(`/api/events/${eventId}`, {
    method: "DELETE",
  });
  if (response.ok) {
    const event = await response.json();
    dispatch(removeEvent(event));
  }
};

const initialState = {};
const eventReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD:
      const newState = {};
      action.list.forEach((event) => {
        newState[event.id] = event;

      });
      return {
        ...newState,
      };
    case LOAD_DETAILS:
      return { ...state, details: action.eventId };
    case ADD_EVENT:
      return { ...state, [action.event.id]: action.event };
    case REMOVE_EVENT:
      const deleteNewState = { ...state };
      delete deleteNewState[action.event.id];
      return deleteNewState;
    default:
      return state;
  }
};

export default eventReducer;
