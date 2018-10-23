import * as React from "react";
import {connect} from "react-redux";
import {Redirect} from "react-router-dom";
import {IUser} from "../../entities/IUser";
import {IState} from "../../store/storeStateInterface";
import {LoginForm} from "./LoginForm";

interface ILoginProps {
  user: IUser | null;
}

export class LoginPage extends React.Component<ILoginProps, any> {
  public state = {
    loggedIn: false,
  };

  public render() {
    if (this.props.user !== null || this.state.loggedIn) {
      return <Redirect to="/"/>;
    }

    return (
      <div className={"w3-container w3-center"}>
        <LoginForm/>
      </div>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  user: state.user,
});

export const Login = connect(mapStateToProps)(LoginPage);
