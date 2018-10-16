import * as React from "react";
import {connect} from "react-redux";

class PageNotFoundErrorPage extends React.Component {
  public render() {
    return (
      <div>
        NotFound
      </div>
    );
  }
}

export const PageNotFound = connect()(PageNotFoundErrorPage);
