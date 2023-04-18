import Login from "pages/Login";
import { useState } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

function Router() {

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/">
          <Login />
        </Route>
      </Switch>
    </BrowserRouter>
  )
}

export default Router;