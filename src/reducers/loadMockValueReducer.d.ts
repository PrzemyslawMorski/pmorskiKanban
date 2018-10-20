import * as actions from "../actions/mockValueActions";
import { Reducer } from "redux";
import { ActionType } from "typesafe-actions";
declare type mockValueAction = ActionType<typeof actions>;
export declare const mockValueReducer: Reducer<string, mockValueAction>;
export {};
