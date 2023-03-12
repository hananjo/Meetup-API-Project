import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import GroupBrowser from "./components/GroupBrowser/GroupBrowser";
import LandingPage from "./components/LandingPage/LandingPage";
import CreateGroupForm from "./components/CreateGroupForm/CreateGroupForm";
import GroupDetail from "./components/GroupDetails/GroupDetails";
import UpdateGroup from "./components/UpdateGroup/UpdateGroup";
import EventBrowser from "./components/EventBrowser/EventBrowser";
import EventDetail from "./components/EventDetails/EventDetails";
import CreateEventForm from "./components/CreateEventForm/CreateEventForm";
import EventGroups from "./components/EventsForGroup/EventsForGroup";
function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact path="/" component={LandingPage} />
          <Route exact path="/groups" component={GroupBrowser} />
          <Route exact path="/events" component={EventBrowser} />
          <Route exact path="/groups/new" component={CreateGroupForm} />
          <Route exact path="/groups/:groupId" component={GroupDetail} />
          {/* <Route path="/api/groups/:groupId" component={EventGroups} /> */}
          <Route
            exact
            path="/groups/:groupId/events"
            component={CreateEventForm}
          />
          <Route exact path="/events/:eventId" component={EventDetail} />
          <Route exact path="/groups/:groupId/update" component={UpdateGroup} />
        </Switch>
      )}
    </>
  );
}

export default App;
