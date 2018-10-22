import * as React from "react";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {IUser} from "../../entities/IUser";
import {IState} from "../../store/storeStateInterface";
import {NavbarUser} from "./NavbarUser";

interface INavbarProps {
  user: IUser | null;
}

class NavbarComponent extends React.Component<INavbarProps, any> {

  public render() {
    return (
      <div className="w3-bar w3-red">
        <Link to="/" className="w3-bar-item w3-button w3-padding-large w3-white w3-mobile">
          <i className="fa fa-home w3-padding-small"/>Home
        </Link>
        {this.boardsLink()}
        {this.accountDropdown()}
      </div>);
  }

  private accountDropdown(): JSX.Element {
    if (this.props.user !== null) {
      return (<div className="w3-dropdown-hover">
        <a className="w3-button w3-padding-large w3-red w3-hover-white">
          <NavbarUser userName={this.props.user.displayName} photoUrl={this.props.user.photoURL}/>
        </a>
        <div className="w3-dropdown-content w3-bar-block w3-border w3-red">
          <Link to="/profile" className="w3-bar-item w3-button w3-red w3-hover-white">Profile</Link>
          <Link to="/logout" className="w3-bar-item w3-button w3-red w3-hover-white">Logout</Link>
        </div>
      </div>);
    } else {
      return (
        <div className="w3-dropdown-hover">
          <button className="w3-button w3-padding-large"><i className="fa fa-user w3-padding-small"/>Account</button>
          <div className="w3-dropdown-content w3-bar-block w3-border">
            <Link to="/login" className="w3-bar-item w3-button w3-padding-large">Login</Link>
            <Link to="/register" className="w3-bar-item w3-button w3-padding-large">Register</Link>
            <Link to="/forgot" className="w3-bar-item w3-button w3-padding-large">Forgot password</Link>
          </div>
        </div>);
    }
  }

  private boardsLink(): JSX.Element | null {
    if (this.props.user !== null) {
      return (<Link to="/boards" className="w3-bar-item w3-button w3-padding-large w3-hover-white w3-mobile">
        <i className="fa fa-list w3-padding-small"/>Boards
      </Link>);
    } else {
      return null;
    }
  }
}

const mapStateToProps = (state: IState) => ({
  user: state.user,
});

export const Navbar = connect(mapStateToProps)(NavbarComponent);
