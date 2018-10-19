import * as React from "react";
import {connect} from "react-redux";

class AboutPage extends React.Component {

  public render() {
    return (
      <div>
        <div>
          <p>{"About us"}</p>
        </div>
      </div>
    );
  }
}

export const About = connect()(AboutPage);
