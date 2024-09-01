import React from "react";
import { UserMiniature } from "../UserMiniature";

interface INavbarUserProps {
  userName: string | null;
  photoUrl: string | null;
}

export const NavbarUser: React.FC<INavbarUserProps> = (props) => {
  const ellipsis: React.CSSProperties = {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  };
  if (
    props.photoUrl === null ||
    props.photoUrl === "" ||
    props.userName === null ||
    props.userName === ""
  ) {
    return (
      <div style={ellipsis}>
        <span>Account</span>
      </div>
    );
  } else {
    return (
      <UserMiniature userName={props.userName} photoUrl={props.photoUrl} />
    );
  }
};
