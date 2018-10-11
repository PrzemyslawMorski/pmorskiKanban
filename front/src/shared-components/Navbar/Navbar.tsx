import {Alignment, Button, Classes, Navbar as BlueprintjsNavbar} from "@blueprintjs/core";
import * as React from "react";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {IUser} from "../../entities/User";
import {initialStoreState} from "../../store/initialStoreState";
import {IState} from "../../store/storeStateInterface";

interface INavbarComponentProps {
  user: IUser;
}

class NavbarComponent extends React.Component<INavbarComponentProps, {}> {
  public render() {
    const userLoggedIn = this.props.user !== initialStoreState.user;

    return (<div>
      <BlueprintjsNavbar>
        <BlueprintjsNavbar.Group align={Alignment.LEFT}>
          <BlueprintjsNavbar.Heading>
            <Link to="/" style={{textDecoration: "none"}}>
              <Button className={Classes.MINIMAL} text="Kanban"/>
            </Link>
          </BlueprintjsNavbar.Heading>

          <BlueprintjsNavbar.Divider/>

          <Link to="/" style={{textDecoration: "none"}}>
            <Button className={Classes.MINIMAL} icon="home" text="Home"/>
          </Link>

          <Link to="/about" style={{textDecoration: "none"}}>
            <Button className={Classes.MINIMAL} icon="info-sign" text="About"/>
          </Link>

          <Link to="/login" style={{textDecoration: "none"}}>
            <Button className={Classes.MINIMAL} icon="user" text="Account"/>
          </Link>

          {userLoggedIn ? "user logged in" : null}
        </BlueprintjsNavbar.Group>
      </BlueprintjsNavbar>
    </div>);
  }
}

function mapStateToProps(state: IState) {
  return {
    user: state.user,
  };
}

export const Navbar = connect(mapStateToProps)(NavbarComponent);
