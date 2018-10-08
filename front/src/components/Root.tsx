import {FocusStyleManager} from "@blueprintjs/core";
import * as React from "react";
import {Provider} from "react-redux";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import {Footer} from "../shared-components/Footer/Footer";
import {configureStore} from "../store/configureStore";
import {PageNotFound} from "./ErrorPages/PageNotFound/PageNotFound";
import {ForgotPassword} from "./ForgotPassword/ForgotPassword";
import {Login} from "./Login/Login";
import {Main} from "./Main/Main";
import {Register} from "./Register/Register";

FocusStyleManager.onlyShowFocusOnTabs();

// import "./Root.css"; JEST doesnt know this file and breaks when testing

const store = configureStore();

export class Root extends React.Component {
  public render() {
    return (
      <Provider store={store}>
        <div className="Site">
          <BrowserRouter>
            <div className="SiteContent">
              <Switch>
                <Route exact={true} path="/" component={Main}/>
                <Route exact={true} path="/about" component={Main}/>

                <Route path="/login" component={Login}/>
                <Route path="/register" component={Register}/>
                <Route path="/forgot" component={ForgotPassword}/>

                <Route path="*" component={PageNotFound}/>
              </Switch>
            </div>
          </BrowserRouter>
          <Footer/>
        </div>
      </Provider>
    );
  }
}
