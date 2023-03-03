import { getEventsForGroup } from "../../store/event";

const EventGroups = () => {
  const events = useSelector((state) => {
    return state?.event;
  });
};

export default EventGroups;
