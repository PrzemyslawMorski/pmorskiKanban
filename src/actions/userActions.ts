import * as firebase from "firebase";
import {action} from "typesafe-actions";
import * as actionTypes from "./constants";

export const userSignedIn = (user: firebase.User) => action(actionTypes.USER_SIGNED_IN, user);
export const userSignedOut = () => action(actionTypes.USER_SIGNED_OUT);
