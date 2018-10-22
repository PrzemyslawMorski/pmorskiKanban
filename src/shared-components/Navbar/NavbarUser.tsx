import * as React from "react";
import {UserMiniature} from "../UserMiniature";

interface INavbarUserProps {
  userName: string | null;
  photoUrl: string | null;
}

export const NavbarUser: React.SFC<INavbarUserProps> = (props) => {
  if (props.photoUrl === null && props.photoUrl === "" || props.userName === null && props.userName === "") {
    return null;
  } else {
    return (<div>
        <UserMiniature photoUrl={props.photoUrl}/>
        <span>{props.userName}</span>
      </div>
    );
  }
};
