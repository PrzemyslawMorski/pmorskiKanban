import * as actions from "../actions/userActions";
import { Reducer } from "redux";
import { ActionType } from "typesafe-actions";
import { IUser } from "../entities/User";
declare type userAction = ActionType<typeof actions>;
export declare const userReducer: Reducer<IUser, userAction>;
export {};
