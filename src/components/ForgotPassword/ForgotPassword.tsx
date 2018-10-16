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
            <button>Home</button>
          </Link>
          <br/>
          <br/>
        </section>
      </section>
    );
  }
}

export const ForgotPassword = connect()(ForgotPasswordPage);
