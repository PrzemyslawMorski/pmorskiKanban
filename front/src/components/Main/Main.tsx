import * as PropTypes from "prop-types";
import * as React from "react";
import {connect} from "react-redux";
import {Route} from "react-router";
import {Navbar} from "../../shared-components/Navbar/Navbar";
import {About} from "./About/About";
import {Home} from "./Home/Home";

class MainPage extends React.Component {
  public static propTypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
  };

  public render(): JSX.Element {
    return (
      <div>
        <Navbar {...this.props}/>
        <Route exact={true} path="/" component={Home}/>
        <Route path="/about" component={About}/>
      </div>
    );
  }
}

export const Main = connect()(MainPage);
