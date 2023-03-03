import { csrfFetch } from "./csrf";

const LOAD = "/events/LOAD";
const LOAD_DETAILS = "/events/LOAD_DETAILS";
const ADD_EVENT = "/events/ADD_EVENT";

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

export const getAllEvents = () => async (dispatch) => {
  const response = await fetch("/api/events");
  console.log("*****", response);
  if (response.ok) {
    const list = await response.json();
    console.log("12345", list);
    dispatch(load(list.Events));
  }
};
export const getEventDetails = (eventId) => async (dispatch) => {
  const response = await fetch(`/api/events/${eventId}`);
  if (response.ok) {
    const event = await response.json();
    console.log(event, "0000");
    dispatch(loadDetails(event));
  }
};

export const addNewEvent = (data) => async (dispatch) => {
  const response = await csrfFetch("/api/events", {
    method: "POST",
    body: JSON.stringify(data),
  });
  const event = await response.json();
  dispatch(addEvent(event));
  return event;
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
    default:
      return state;
  }
};

export default eventReducer;
