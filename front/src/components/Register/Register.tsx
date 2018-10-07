import * as React from "react";
import {connect} from "react-redux";

class RegisterPage extends React.Component {
  public render() {
    return (
      <div>
        Register
      </div>
    );
  }
}

export const Register = connect()(RegisterPage);
