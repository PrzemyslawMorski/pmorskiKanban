import * as React from "react";

const FooterStyles: React.CSSProperties = {
  alignItems: "center",
  display: "flex",
  justifyContent: "center",
};

const PStyles: React.CSSProperties = {
  marginLeft: "15px",
  marginRight: "15px",
  textAlign: "center",
};

export class Footer extends React.Component {
  public render() {
    return (
      <footer style={FooterStyles}>
        <p style={PStyles}>Przemysław Morski</p>
        <p style={PStyles}>Kanban 2018</p>
        <p style={PStyles}>morski.przemek@gmail.com</p>
        <p style={PStyles}>(+48) 798-639-098</p>
      </footer>
    );
  }
}
