import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { IUser } from "../../entities/IUser";
import { IState } from "../../store/storeStateInterface";
import { NavbarUser } from "./NavbarUser";

interface INavbarProps {
  user: IUser | null;
}

class NavbarComponent extends React.Component<INavbarProps, any> {
  public render() {
    if (this.props.user !== null) {
      return (
        <div className="w3-row w3-theme">
          <Link to="/" className="w3-col s3 m1 l1 w3-button w3-white">
            <i className="fa fa-home w3-padding-small" />
          </Link>

          <Link
            to="/boards"
            className="w3-col s4 m2 l2 w3-button w3-hover-white"
          >
            <i className="fa fa-list w3-padding-small" />
            Boards
          </Link>

          <div className="w3-col s5 m3 l2 w3-dropdown-hover">
            <a className="w3-button w3-block w3-theme w3-hover-white">
              <NavbarUser
                userName={this.props.user.displayName}
                photoUrl={this.props.user.photoURL}
              />
            </a>
            <div
              className="w3-dropdown-content w3-bar-block w3-border w3-theme"
              style={{ width: "100%" }}
            >
              <Link
                to="/profile"
                className="w3-bar-item w3-button w3-theme w3-hover-white"
              >
                Profile
              </Link>
              <Link
                to="/logout"
                className="w3-bar-item w3-button w3-theme w3-hover-white"
              >
                Logout
              </Link>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="w3-row w3-theme">
          <Link to="/" className="w3-col s3 m1 l1 w3-button w3-white">
            <i className="fa fa-home w3-padding-small" />
          </Link>

          <div className="w3-col s9 m2 l2 w3-dropdown-hover">
            <button className="w3-button w3-block">
              <i className="fa fa-user w3-padding-small" />
              Account
            </button>
            <div
              className="w3-dropdown-content w3-bar-block w3-border"
              style={{ width: "100%" }}
            >
              <Link
                to="/login"
                className="w3-bar-item w3-button w3-padding-large"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="w3-bar-item w3-button w3-padding-large"
              >
                Register
              </Link>
              <Link
                to="/forgot"
                className="w3-bar-item w3-button w3-padding-large"
              >
                Forgot password
              </Link>
            </div>
          </div>
        </div>
      );
    }
  }
}

const mapStateToProps = (state: IState) => ({
  user: state.user,
});

export const Navbar = connect(mapStateToProps)(NavbarComponent);
