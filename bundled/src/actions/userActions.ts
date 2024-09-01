import {action} from "typesafe-actions";
import {IUser} from "../entities/IUser";
import * as actionTypes from "./constants";

export const updateUser = (user: IUser | null) => action(actionTypes.UPDATE_USER, {user});
// local action, doesn't need error handling

export const newUsername = (username: string) => action(actionTypes.UPDATE_USER_NAME, {username});
export const newUsernameError = (message: string) => action(actionTypes.UPDATE_USER_NAME_ERROR, {message});
