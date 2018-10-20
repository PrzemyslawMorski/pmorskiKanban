import * as React from "react";
import {Redirect} from "react-router-dom";
import {IErrorResponse} from "../../dtos/auth";
import {logoutUser} from "../../services/authService";

export const Logout: React.SFC = () => {
  logoutUser().subscribe(
    undefined,
    (error: IErrorResponse) => {
      console.log(error);
      alert("There was an error when logging you out. Please contact our support staff.");
    });
  return (<Redirect to={"/"}/>);
};
