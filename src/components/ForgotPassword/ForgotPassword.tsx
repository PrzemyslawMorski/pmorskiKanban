import * as React from "react";
import {connect} from "react-redux";
import {ForgotPasswordForm} from "./ForgotPasswordForm";

class ForgotPasswordPage extends React.Component {
  public render() {
    return (
      <div>
        <ForgotPasswordForm/>
      </div>
    );
  }
}

export const ForgotPassword = connect()(ForgotPasswordPage);
