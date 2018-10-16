import * as React from "react";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {IUser} from "../../entities/User";
import {initialStoreState} from "../../store/initialStoreState";
import {IState} from "../../store/storeStateInterface";
import "./Navbar.css";

interface INavbarComponentProps {
  user: IUser;
}

class NavbarComponent extends React.Component<INavbarComponentProps, {}> {
  public render() {
    const userLoggedIn = this.props.user !== initialStoreState.user;

    return (<div id="navbar">
      <ul>
        <li>
          <Link to="/">
            <button>Kanban</button>
          </Link></li>
        <li>
          <Link to="/">
            <button>Home</button>
          </Link>
        </li>
        <li>
          <Link to="/about">
            <button>About</button>
          </Link>
        </li>
        <li>
          <Link to="/login">
            <button>Login</button>
          </Link>
        </li>
        <li>
          <Link to="/register">
            <button>Register</button>
          </Link>
        </li>
      </ul>

      {userLoggedIn ? "user logged in" : null}
    </div>);
  }
}

function mapStateToProps(state: IState) {
  return {
    user: state.user,
  };
}

export const Navbar = connect(mapStateToProps)(NavbarComponent);
