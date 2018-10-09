import {Button, H1, H5} from "@blueprintjs/core";
import * as Classes from "@blueprintjs/core/lib/esm/common/classes";
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
        <section>
          <br/>
          <Link to="/" style={{textDecoration: "none"}}>
            <Button className={Classes.MINIMAL} icon="home" text="Home"/>
          </Link>
          <br/>
          <br/>
        </section>
      </section>
    );
  }
}

export const Login = connect()(LoginPage);
