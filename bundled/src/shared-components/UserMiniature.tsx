import React from "react";

interface IUserMiniatureProps {
  userName: string | null;
  photoUrl: string | null;
}

export const UserMiniature: React.FC<IUserMiniatureProps> = (props) => {
  const ellipsis: React.CSSProperties = {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  };
  const imgStyles: React.CSSProperties = {
    height: "20px",
  };
  return (
    <div>
      <div className="w3-row w3-hide-medium w3-hide-large">
        <div className="w3-col" style={{ width: "40px" }}>
          <img
            className={"w3-image w3-circle"}
            src={props.photoUrl!}
            style={imgStyles}
          />
        </div>
        <div className="w3-rest" style={ellipsis}>
          <span>{props.userName}</span>
        </div>
      </div>

      <div style={ellipsis} className="w3-left-align w3-hide-small">
        <img
          className={"w3-image w3-circle"}
          src={props.photoUrl!}
          style={imgStyles}
        />
        <span style={{ marginLeft: "10px" }}>{props.userName}</span>
      </div>
    </div>
  );
};
