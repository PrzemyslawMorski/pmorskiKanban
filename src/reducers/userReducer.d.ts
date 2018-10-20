import * as firebase from "firebase";
import { Reducer } from "redux";
import { ActionType } from "typesafe-actions";
import * as actions from "../actions/userActions";
declare type userActions = ActionType<typeof actions>;
export declare const userReducer: Reducer<firebase.User | null, userActions>;
export {};
