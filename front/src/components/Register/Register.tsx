import {Button, H1, H5} from "@blueprintjs/core";
import * as Classes from "@blueprintjs/core/lib/esm/common/classes";
import * as React from "react";
import {connect} from "react-redux";
import {Link, Redirect} from "react-router-dom";
import {tokenExists} from "../../services/tokenService";
import {RegisterForm} from "./RegisterForm";

class RegisterPage extends React.Component {
  public render() {
    if (tokenExists()) {
      return <Redirect to="/"/>;
    }

    return (
      <div>
        <H1>Create a Pmorski Kanban account</H1>
        <span>
          <H5>or <Link to="/login">log in here</Link></H5>
        </span>

        <section>
          <br/>
          <Link to="/" style={{textDecoration: "none"}}>
            <Button className={Classes.MINIMAL} icon="home" text="Home"/>
          </Link>
          <br/>
          <br/>
        </section>

        <RegisterForm/>
      </div>
    );
  }
}

export const Register = connect()(RegisterPage);
