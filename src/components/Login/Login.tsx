import * as firebase from "firebase";
import * as React from "react";
import {StyledFirebaseAuth} from "react-firebaseui";
import {connect} from "react-redux";
import {Redirect} from "react-router-dom";
import {IUser} from "../../entities/IUser";
import {IState} from "../../store/storeStateInterface";
import {LoginForm} from "./LoginForm";

interface ILoginProps {
  user: IUser | null;
}

export class LoginPage extends React.Component<ILoginProps, any> {
  public state = {
    loggedIn: false,
  };

  public render() {
    if (this.props.user !== null || this.state.loggedIn) {
      return <Redirect to="/"/>;
    }

    const uiConfig = {
      callbacks: {
        signInSuccessWithAuthResult: () => {
          this.setState({loggedIn: true});
          return false;
        },
      },
      signInFlow: "popup",
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      ],

    };

    return (
      <div className={"w3-container w3-center"}>
        <LoginForm/>
        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()}/>
      </div>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  user: state.user,
});

export const Login = connect(mapStateToProps)(LoginPage);
