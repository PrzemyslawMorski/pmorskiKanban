import * as firebase from "firebase";
import * as React from "react";
import {Provider} from "react-redux";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import {userLoggedIn, userLoggedOut} from "../actions/userActions";
import {IUser} from "../entities/User";
import {removeToken} from "../services/tokenService";
import {Footer} from "../shared-components/Footer/Footer";
import {Navbar} from "../shared-components/Navbar/Navbar";
import {configureStore} from "../store/configureStore";
import {PageNotFound} from "./ErrorPages/PageNotFound/PageNotFound";
import {ForgotPassword} from "./ForgotPassword/ForgotPassword";
import {Login} from "./Login/Login";
import {Main} from "./Main/Main";
import {Register} from "./Register/Register";
import {Logout} from "../shared-components/Logout/Logout";

const store = configureStore();

const config = {
  apiKey: "AIzaSyDaUHVi_rFdTLYH3GTgRKEAGpJkcT2IMOY",
  authDomain: "pmorskikanban.firebaseapp.com",
  databaseURL: "https://pmorskikanban.firebaseio.com",
  messagingSenderId: "81914965876",
  projectId: "pmorskikanban",
  storageBucket: "pmorskikanban.appspot.com",
};

firebase.initializeApp(config);

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    const kanbanUser: IUser = {
      email: user.email!,
      name: user.displayName!,
      photoURL: user.photoURL!,
      uid: user.uid,
    };
    store.dispatch(userLoggedIn(kanbanUser));
  } else {
    store.dispatch(userLoggedOut());
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
              <Route exact={true} path="/" component={Main}/>
              <Route exact={true} path="/about" component={Main}/>

              <Route path="/login" component={Login}/>
              <Route path="/register" component={Register}/>
              <Route path="/forgot" component={ForgotPassword}/>
              <Route path="/logout" component={Logout}/>

              <Route path="*" component={PageNotFound}/>
            </Switch>
            <Footer/>
          </div>
        </BrowserRouter>
      </Provider>
    );
  }
}
