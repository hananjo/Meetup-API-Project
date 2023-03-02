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
          <Route exact path="/api/groups" component={GroupBrowser} />
          <Route exact path="/api/events" component={EventBrowser} />
          <Route exact path="/api/groups/new" component={CreateGroupForm} />
          <Route exact path="/api/groups/:groupId" component={GroupDetail} />
          <Route
            exact
            path="/api/groups/:groupId/update"
            component={UpdateGroup}
          />
        </Switch>
      )}
    </>
  );
}

export default App;
