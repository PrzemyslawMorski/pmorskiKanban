import * as React from "react";
import {StaticContext, withRouter} from "react-router";

class AuthActionPage extends React.Component<any, StaticContext, any> {
  public render() {
    console.log(this.props.match.params);
    return (
      <div>
        Action {this.props.match.params.mode.toString()}
      </div>
    );
  }
}

export const AuthAction = withRouter(AuthActionPage);
