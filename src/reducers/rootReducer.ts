import {combineReducers} from "redux";
import {mockValueReducer} from "./loadMockValueReducer";
import {userReducer} from "./userReducer";

export const rootReducer = combineReducers({
  appName: mockValueReducer,
  user: userReducer,
});
