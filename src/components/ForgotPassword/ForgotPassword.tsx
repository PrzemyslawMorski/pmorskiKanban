import * as firebase from "firebase";
import * as React from "react";
import {connect} from "react-redux";
import {Redirect} from "react-router";
import {ForgotPasswordForm} from "./ForgotPasswordForm";
import {IState} from "../../store/storeStateInterface";

interface IForgotPasswordProps {
  user: firebase.User | null;
}

export class ForgotPasswordPage extends React.Component<IForgotPasswordProps, any> {
  public render() {
    if (this.props.user !== null) {
      return <Redirect to="/"/>;
    }

    return (
      <div>
        <ForgotPasswordForm/>
      </div>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  user: state.user,
});

export const ForgotPassword = connect(mapStateToProps)(ForgotPasswordPage);
