import * as firebase from "firebase";
import * as React from "react";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {IState} from "../../store/storeStateInterface";

interface INavbarProps {
  user: firebase.User | null;
}

class NavbarComponent extends React.Component<INavbarProps, any> {

  private static accountDropdownContent() {
    if (firebase.auth().currentUser !== null) {
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

  public render() {
    return (
      <div className="w3-bar w3-red w3-card w3-left-align w3-large">
        <Link to="/" className="w3-bar-item w3-button w3-padding-large w3-white w3-mobile">
          <i className="fa fa-home w3-padding-small"/>Home</Link>
        <div className="w3-dropdown-hover">
          <button className="w3-button w3-padding-large"><i className="fa fa-user w3-padding-small"/>Account</button>
          {NavbarComponent.accountDropdownContent()}
        </div>
        {this.userProfile()}
      </div>);
  }

  private userProfile() {
    if (this.props.user !== null) {
      if (this.props.user.photoURL !== null && this.props.user.photoURL !== "") {
        return (<div className={" w3-right"}>
            <img
              className={"w3-circle"}
              src={this.props.user.photoURL!}
              width={40}
              height={40}
            />
            <span>{this.props.user.displayName}</span>
          </div>
        );
      } else {
        return (<div className={"w3-right"}>
            <span>{this.props.user.displayName}</span>
          </div>
        );
      }
    } else {
      return null;
    }
  }
}

const mapStateToProps = (state: IState) => ({
  user: state.user,
});

export const Navbar = connect(mapStateToProps)(NavbarComponent);
