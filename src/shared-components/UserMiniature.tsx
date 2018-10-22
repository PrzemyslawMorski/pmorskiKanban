import * as React from "react";

interface IUserMiniatureProps {
  photoUrl: string | null;
}

const imgStyles: React.CSSProperties = {
  height: "20px",
};

export const UserMiniature: React.SFC<IUserMiniatureProps> = (props) => {
  if (props.photoUrl === null || props.photoUrl === "") {
    return null;
  } else {
    return <img
      className={"w3-image w3-circle w3-margin-right"}
      src={props.photoUrl!}
      style={imgStyles}
    />;
  }
};
