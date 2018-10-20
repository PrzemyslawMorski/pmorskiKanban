import * as React from "react";
import {StaticContext, withRouter} from "react-router";

export class AuthHandlerComponent extends React.Component<any, StaticContext, any> {
  public render() {
    return (
      <div>
        Handler: {this.props.match.params.mode}
      </div>
    );
  }
}

export const AuthHandler = withRouter(AuthHandlerComponent);
