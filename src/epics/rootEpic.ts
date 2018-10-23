import {combineEpics} from "redux-observable";
import {boardMiniaturesEpic} from "./boardMiniaturesEpic";

export const rootEpic = combineEpics(
  boardMiniaturesEpic,
);
