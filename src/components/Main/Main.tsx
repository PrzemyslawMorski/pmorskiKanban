import * as React from "react";
import {connect} from "react-redux";
import {Route} from "react-router";
import {About} from "./About/About";
import {Home} from "./Home/Home";

class MainPage extends React.Component {
  public render(): JSX.Element {
    return (
      <div>
        <Route exact={true} path="/" component={Home}/>
        <Route path="/about" component={About}/>
      </div>
    );
  }
}

export const Main = connect()(MainPage);
