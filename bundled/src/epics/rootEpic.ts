import { combineEpics } from "redux-observable";
import {
  addViewerEpic,
  createBoardEpic,
  deleteBoardEpic,
  getBoardEpic,
  getCreatedBoardEpic,
  removeViewerEpic,
  renameBoardEpic,
  resetBoardIfDeletedEpic,
} from "./boardEpics";
import {
  getBoardMiniaturesOnNewUserDataEpic,
  unsubBoardEpic,
} from "./boardMiniaturesEpics";
import { alertErrorEpic } from "./errorEpic";
import {
  createListEpic,
  deleteListEpic,
  moveListEpic,
  renameListEpic,
} from "./listEpics";
import {
  addAttachmentEpic,
  addCommentEpic,
  changeTaskDescriptionEpic,
  createTaskEpic,
  deleteAttachmentEpic,
  deleteCommentEpic,
  deleteTaskEpic,
  editCommentEpic,
  moveTaskEpic,
  renameTaskEpic,
} from "./taskEpics";

export const rootEpic = combineEpics(
  alertErrorEpic,
  addAttachmentEpic,
  addCommentEpic,
  addViewerEpic,
  changeTaskDescriptionEpic,
  createBoardEpic,
  createListEpic,
  createTaskEpic,
  removeViewerEpic,
  deleteAttachmentEpic,
  deleteBoardEpic,
  deleteCommentEpic,
  deleteListEpic,
  deleteTaskEpic,
  editCommentEpic,
  getCreatedBoardEpic,
  getBoardEpic,
  getBoardMiniaturesOnNewUserDataEpic,
  renameBoardEpic,
  renameListEpic,
  renameTaskEpic,
  resetBoardIfDeletedEpic,
  moveListEpic,
  moveTaskEpic,
  unsubBoardEpic
);
