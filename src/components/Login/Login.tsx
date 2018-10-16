import * as React from "react";
import {connect} from "react-redux";
import {Redirect} from "react-router-dom";
import {tokenExists} from "../../services/tokenService";
import {LoginForm} from "./LoginForm";

class LoginPage extends React.Component {
  public render() {
    if (tokenExists()) {
      return <Redirect to="/"/>;
    }

    return (
      <section>
        <LoginForm/>
      </section>
    );
  }
}

export const Login = connect()(LoginPage);
