import * as React from "react";
import {connect} from "react-redux";
import {IUser} from "../../entities/IUser";
import {IState} from "../../store/storeStateInterface";
import {RegisterForm} from "./RegisterForm";
import {Redirect} from "react-router";

interface IRegisterProps {
  user: IUser | null;
}

export class RegisterPage extends React.Component<IRegisterProps, any> {
  public render() {
    if (this.props.user !== null) {
      return <Redirect to="/"/>;
    }

    return (
      <div>
        <RegisterForm/>
      </div>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  user: state.user,
});

export const Register = connect(mapStateToProps)(RegisterPage);
