import {Alignment, Button, Navbar as BlueprintjsNavbar} from "@blueprintjs/core";
import * as React from "react";
import {Link} from "react-router-dom";

export class Navbar extends React.Component {
  public render() {
    return <div>
      <BlueprintjsNavbar>
        <BlueprintjsNavbar.Group align={Alignment.LEFT}>
          <BlueprintjsNavbar.Heading>
            <Link to="/" style={{textDecoration: "none"}}>
              <Button className="bp3-minimal" text="Kanban"/>
            </Link>
          </BlueprintjsNavbar.Heading>

          <BlueprintjsNavbar.Divider/>

          <Link to="/" style={{textDecoration: "none"}}>
            <Button className="bp3-minimal" icon="home" text="Home"/>
          </Link>

          <Link to="/about" style={{textDecoration: "none"}}>
            <Button className="bp3-minimal" icon="info-sign" text="About"/>
          </Link>
        </BlueprintjsNavbar.Group>
      </BlueprintjsNavbar>
    </div>;
  }
}
