import * as firebase from "firebase";
import * as React from "react";
import {Provider} from "react-redux";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import {userSignedIn, userSignedOut} from "../actions/userActions";
import {setupFirebase} from "../firebase";
// ^^ this is not in the repo, create a file with firebase config and a firebase.initApp call
import {removeToken, saveToken} from "../services/tokenService";
import {Logout} from "../shared-components/Logout/Logout";
import {Navbar} from "../shared-components/Navbar/Navbar";
import {configureStore} from "../store/configureStore";
import {Board} from "./Board/Board";
import {Boards} from "./Boards/Boards";
import {PageNotFound} from "./ErrorPages/PageNotFound/PageNotFound";
import {ForgotPassword} from "./ForgotPassword/ForgotPassword";
import {Home} from "./Home/Home";
import {Login} from "./Login/Login";
import {Profile} from "./Profile/Profile";
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
      <div style={{height: "100vh", width: "100vw"}}>
        <Provider store={store}>
          <BrowserRouter>
            <div style={{height: "100vh"}}>
              <Navbar/>
              <Switch>
                <Route path="/login" component={Login}/>
                <Route path="/logout" component={Logout}/>
                <Route path="/register" component={Register}/>
                <Route path="/forgot" component={ForgotPassword}/>
                <Route path="/profile" component={Profile}/>

                <Route path="/boards" component={Boards}/>
                <Route path="/board/:id" component={Board}/>

                <Route exact={true} path="/" component={Home}/>

                <Route path="*" component={PageNotFound}/>
              </Switch>
            </div>
          </BrowserRouter>
        </Provider>
      </div>

    );
  }
}
