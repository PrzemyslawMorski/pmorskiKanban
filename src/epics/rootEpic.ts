import {combineEpics} from "redux-observable";
import {mockValueEpic} from "./mockValueEpic";

export const rootEpic = combineEpics(mockValueEpic);
