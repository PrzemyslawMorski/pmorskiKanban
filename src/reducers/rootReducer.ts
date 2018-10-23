import {combineReducers} from "redux";
import {boardsReducer} from "./boardsReducer";
import {userReducer} from "./userReducer";

export const rootReducer = combineReducers({
  boards: boardsReducer,
  user: userReducer,
});
