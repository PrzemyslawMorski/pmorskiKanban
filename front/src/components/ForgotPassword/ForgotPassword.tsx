import * as React from "react";
import {connect} from "react-redux";

class ForgotPasswordPage extends React.Component {
  public render() {
    return (
      <div>
        Forgot password
      </div>
    );
  }
}

export const ForgotPassword = connect()(ForgotPasswordPage);
