import {Button} from "@blueprintjs/core";
import * as Classes from "@blueprintjs/core/lib/esm/common/classes";
import * as React from "react";
import {connect} from "react-redux";
import {Link} from "react-router-dom";

class ForgotPasswordPage extends React.Component {
  public render() {
    return (
      <section>
        Forgot password
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

export const ForgotPassword = connect()(ForgotPasswordPage);
