import * as React from "react";

export class Footer extends React.Component {
  public render() {
    return (
      <footer id="footer" className={"w3-container"}>
        <p className={"w3-quarter w3-mobile"}>Przemysław Morski</p>
        <p className={"w3-quarter w3-mobile"}>Kanban 2018</p>
        <p className={"w3-quarter w3-mobile"}>morski.przemek@gmail.com</p>
        <p className={"w3-quarter w3-mobile"}>(+48) 798-639-098</p>
      </footer>
    );
  }
}
