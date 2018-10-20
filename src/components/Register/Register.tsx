import * as React from "react";
import {connect} from "react-redux";
import {Redirect} from "react-router-dom";
import {IUser} from "../../entities/User";
import {IState} from "../../store/storeStateInterface";
import {RegisterForm} from "./RegisterForm";

interface IRegisterPageProps {
  user: IUser | null;
}

class RegisterPage extends React.Component<IRegisterPageProps, {}> {
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

function mapStateToProps(state: IState) {
  return {
    user: state.user,
  };
}

export const Register = connect(mapStateToProps)(RegisterPage);
