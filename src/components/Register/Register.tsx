import * as firebase from "firebase";
import * as React from "react";
import {connect} from "react-redux";
import {Redirect} from "react-router-dom";
import {IState} from "../../store/storeStateInterface";
import {RegisterForm} from "./RegisterForm";

interface IRegisterProps {
  user: firebase.User | null;
}

export class RegisterPage extends React.Component<IRegisterProps, any> {
  public render() {
    if (firebase.auth().currentUser !== null) {
      return <Redirect to="/"/>;
    }

    return (
      <div>
        <RegisterForm/>
      </div>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  user: state.user,
});

export const Register = connect(mapStateToProps)(RegisterPage);
