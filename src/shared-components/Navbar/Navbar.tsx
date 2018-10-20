import * as React from "react";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {IUser} from "../../entities/User";
import {IState} from "../../store/storeStateInterface";

interface INavbarComponentProps {
  user: IUser | null;
}

class NavbarComponent extends React.Component<INavbarComponentProps, {}> {

  public render() {
    return (
      <div className="w3-bar w3-red w3-card w3-left-align w3-large">
        <Link to="/" className="w3-bar-item w3-button w3-padding-large w3-white w3-mobile">
          <i className="fa fa-home w3-padding-small"/>Home</Link>
        <div className="w3-dropdown-hover">
          <button className="w3-button w3-padding-large"><i className="fa fa-user w3-padding-small"/>Account</button>
          {this.accountDropdownContent()}
        </div>
      </div>);
  }

  private accountDropdownContent() {
    if (this.props.user) {
      return (<div className="w3-dropdown-content w3-bar-block w3-border">
        <Link to="/profile" className="w3-bar-item w3-button w3-padding-large">Profile</Link>
        <Link to="/logout" className="w3-bar-item w3-button w3-padding-large">Logout</Link>
      </div>);
    } else {
      return (<div className="w3-dropdown-content w3-bar-block w3-border">
        <Link to="/login" className="w3-bar-item w3-button w3-padding-large">Login</Link>
        <Link to="/register" className="w3-bar-item w3-button w3-padding-large">Register</Link>
        <Link to="/forgot" className="w3-bar-item w3-button w3-padding-large">Forgot password</Link>
      </div>);
    }
  }
}

function mapStateToProps(state: IState) {
  return {
    user: state.user,
  };
}

export const Navbar = connect(mapStateToProps)(NavbarComponent);
