import * as firebase from "firebase";
import * as React from "react";
import {StyledFirebaseAuth} from "react-firebaseui";
import {connect} from "react-redux";
import {Redirect} from "react-router-dom";
import {IState} from "../../store/storeStateInterface";
import {LoginForm} from "./LoginForm";

interface ILoginProps {
  user: firebase.User | null;
}

export class LoginPage extends React.Component<ILoginProps, any> {
  public state = {
    loggedIn: false,
  };

  public render() {
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
        firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        firebase.auth.GithubAuthProvider.PROVIDER_ID,
      ],

    };

    if (this.props.user !== null || this.state.loggedIn) {
      return <Redirect to="/"/>;
    }

    return (
      <div className={"w3-container w3-panel w3-padding-large w3-center"}>
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
