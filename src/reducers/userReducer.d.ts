import { Reducer } from "redux";
import { ActionType } from "typesafe-actions";
import * as actions from "../actions/userActions";
import { IUser } from "../entities/IUser";
declare type userActions = ActionType<typeof actions>;
export declare const userReducer: Reducer<IUser | null, userActions>;
export {};
