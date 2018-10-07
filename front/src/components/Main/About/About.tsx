import * as React from "react";
import {connect} from "react-redux";
import {IState} from "../../../store/storeStateInterface";

interface IAboutPageProps {
  appName: string;
}

class AboutPage extends React.Component<IAboutPageProps, {}> {

  public render() {
    return (
      <div>
        <div>
          <p>{"About us - " + this.props.appName}</p>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state: IState) {
  return {
    appName: state.appName,
  };
}

export const About = connect(mapStateToProps)(AboutPage);
