import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { resetBoard } from "../actions/boardActions";
import { updateUser } from "../actions/userActions";
import { IUser } from "../entities/IUser";
import { setupFirebase } from "../firebase";
import { Alert } from "../shared-components/Alert/Alert";
// ^^ this is not in the repo, create a file with firebase config and a firebase.initApp call
import { Logout } from "../shared-components/Logout/Logout";
import { Modal } from "../shared-components/Modal/Modal";
import { Navbar } from "../shared-components/Navbar/Navbar";
import { Spinner } from "../shared-components/Spinner/Spinner";
import { configureStore } from "../store/configureStore";
import { Board } from "./Board/Board";
import { Boards } from "./Boards/Boards";
import { CreateBoard } from "./CreateBoard/CreateBoard";
import { ForgotPassword } from "./ForgotPassword/ForgotPassword";
import { Home } from "./Home/Home";
import { Login } from "./Login/Login";
import { Profile } from "./Profile/Profile";
import { Register } from "./Register/Register";
import { getAuth, User } from "firebase/auth";

const store = configureStore();
setupFirebase();

export class Root extends React.Component {
  public state = {
    waitingForFirstAuthResponse: true,
  };

  private firebaseUnsub = getAuth().onAuthStateChanged((user: User | null) => {
    if (user !== null) {
      const iuser: IUser = {
        displayName: user.displayName!,
        email: user.email!,
        photoURL: user.photoURL!,
        uid: user.uid,
      };
      store.dispatch(updateUser(iuser));
    } else {
      store.dispatch(updateUser(null));
      store.dispatch(resetBoard());
    }
    this.setState({ waitingForFirstAuthResponse: false });
  });

  public componentWillUnmount() {
    this.firebaseUnsub();
  }

  public render() {
    if (this.state.waitingForFirstAuthResponse) {
      return <Spinner />;
    }

    return (
      <Provider store={store}>
        <BrowserRouter>
          <div
            className="w3-theme-l3"
            style={{
              display: "flex",
              flexFlow: "column",
              height: "100%",
              width: "100%",
            }}
          >
            <div style={{ flex: "0 1 40px" }}>
              <Navbar />
            </div>
            <div style={{ display: "flex", flexFlow: "column", flex: "1" }}>
              <Switch>
                <Route path="/login" component={Login} />
                <Route path="/logout" component={Logout} />
                <Route path="/register" component={Register} />
                <Route path="/forgot" component={ForgotPassword} />
                <Route path="/profile" component={Profile} />

                <Route path="/boards" component={Boards} />
                <Route path="/board/:boardId" component={Board} />
                <Route path="/board-create" component={CreateBoard} />

                <Route exact={true} path="/" component={Home} />
              </Switch>
            </div>
            <Modal />
            <Alert />
          </div>
        </BrowserRouter>
      </Provider>
    );
  }
}
