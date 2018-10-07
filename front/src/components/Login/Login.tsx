import {H1, H5} from "@blueprintjs/core";
import * as React from "react";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {LoginForm} from "./LoginForm";

class LoginPage extends React.Component {
  public render() {
    return (
      <section>
        <H1>Log in to Pmorski Kanban</H1>
        <span>
          <H5>or <Link to="/register">register here</Link></H5>
        </span>
        <LoginForm/>
        <span><Link to="/forgot">forgot password?</Link></span>
      </section>
    );
  }
}

export const Login = connect()(LoginPage);
