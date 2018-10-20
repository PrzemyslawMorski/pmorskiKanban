import * as React from "react";
import {connect} from "react-redux";
import {Redirect} from "react-router";
import {IUser} from "../../entities/User";
import {IState} from "../../store/storeStateInterface";
import {ForgotPasswordForm} from "./ForgotPasswordForm";

interface IForgotPasswordPageProps {
  user: IUser | null;
}

class ForgotPasswordPage extends React.Component<IForgotPasswordPageProps, {}> {
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

function mapStateToProps(state: IState) {
  return {
    user: state.user,
  };
}

export const ForgotPassword = connect(mapStateToProps)(ForgotPasswordPage);
