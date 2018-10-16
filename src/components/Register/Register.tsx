import * as React from "react";
import {connect} from "react-redux";
import {Redirect} from "react-router-dom";
import {tokenExists} from "../../services/tokenService";
import {RegisterForm} from "./RegisterForm";

class RegisterPage extends React.Component {
  public render() {
    if (tokenExists()) {
      return <Redirect to="/"/>;
    }

    return (
      <div>
        <RegisterForm/>
      </div>
    );
  }
}

export const Register = connect()(RegisterPage);
