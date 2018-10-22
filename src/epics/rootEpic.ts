import {combineEpics} from "redux-observable";
import {mockValueEpic} from "./mockValueEpic";
import {newUsernameEpic} from "./newUsernameEpic";

export const rootEpic = combineEpics(mockValueEpic, newUsernameEpic);
