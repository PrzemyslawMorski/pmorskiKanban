import { combineReducers } from "redux";
import { mockValueReducer } from "./loadMockValueReducer";

export const rootReducer = combineReducers({
    appName: mockValueReducer,
});
