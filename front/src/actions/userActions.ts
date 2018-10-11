import {action} from "typesafe-actions";
import {IUser} from "../entities/User";
import * as actionTypes from "./constants";

export const userLoggedIn =
  (value: IUser) => action(actionTypes.USER_LOGGED_IN, value);
