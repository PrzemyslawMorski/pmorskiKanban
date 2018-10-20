import * as firebase from "firebase";
import * as React from "react";
import {Provider} from "react-redux";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import {userSignedIn, userSignedOut} from "../actions/userActions";
import {setupFirebase} from "../firebase";
import {removeToken, saveToken} from "../services/tokenService";
import {Footer} from "../shared-components/Footer/Footer";
import {Logout} from "../shared-components/Logout/Logout";
import {Navbar} from "../shared-components/Navbar/Navbar";
import {configureStore} from "../store/configureStore";
import {PageNotFound} from "./ErrorPages/PageNotFound/PageNotFound";
import {ForgotPassword} from "./ForgotPassword/ForgotPassword";
import {Home} from "./Home/Home";
import {Login} from "./Login/Login";
import {Register} from "./Register/Register";

const store = configureStore();

setupFirebase();

firebase.auth().onAuthStateChanged((user: firebase.User | null) => {
  if (user !== null) {
    user.getIdToken().then((token) => {
      store.dispatch(userSignedIn(user));
      saveToken(token);
    });
  } else {
    store.dispatch(userSignedOut());
    removeToken();
  }
});

export class Root extends React.Component {
  public render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <div>
            <Navbar/>
            <Switch>
              <Route path="/login" component={Login}/>
              <Route path="/logout" component={Logout}/>
              <Route path="/register" component={Register}/>
              <Route path="/forgot" component={ForgotPassword}/>

              <Route exact={true} path="/" component={Home}/>

              <Route path="*" component={PageNotFound}/>
            </Switch>
            <Footer/>
          </div>
        </BrowserRouter>
      </Provider>
    );
  }
}
