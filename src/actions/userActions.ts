import {action} from "typesafe-actions";
import {IUser} from "../entities/IUser";
import * as actionTypes from "./constants";

export const userData = (user: IUser | null) => action(actionTypes.USER_DATA, user);
export const newUsername = (username: string) => action(actionTypes.NEW_USER_NAME, username);
