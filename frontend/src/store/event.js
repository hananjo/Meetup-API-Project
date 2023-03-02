const LOAD = "events/LOAD";

const load = (list) => ({
  type: LOAD,
  list,
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

const initialState = {
    events: [],
  };
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
     default:
        return state
    }
  };

  export default eventReducer;
