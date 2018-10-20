import * as React from "react";
import {connect} from "react-redux";
import {Redirect} from "react-router-dom";
import {IUser} from "../../entities/User";
import {IState} from "../../store/storeStateInterface";
import {LoginForm} from "./LoginForm";

interface ILoginPageProps {
  user: IUser | null;
}

class LoginPage extends React.Component<ILoginPageProps, {}> {
  public render() {
    if (this.props.user !== null) {
      return <Redirect to="/"/>;
    }

    return (
      <section>
        <LoginForm/>
      </section>
    );
  }
}

function mapStateToProps(state: IState) {
  return {
    user: state.user,
  };
}

export const Login = connect(mapStateToProps)(LoginPage);
