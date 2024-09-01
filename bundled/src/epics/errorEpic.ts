import { ActionsObservable, Epic, ofType } from "redux-observable";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ActionType } from "typesafe-actions";
import * as alertActions from "../actions/alertActions";
import * as boardActions from "../actions/boardActions";
import {
  ADD_ATTACHMENT_ERROR,
  ADD_COMMENT_ERROR,
  ADD_VIEWER_ERROR,
  CHANGED_TASK_DESCRIPTION_ERROR,
  CREATED_BOARD_ERROR,
  CREATED_LIST_ERROR,
  CREATED_TASK_ERROR,
  DELETE_COMMENT_ERROR,
  DELETED_BOARD_ERROR,
  DELETED_LIST_ERROR,
  DELETED_TASK_ERROR,
  EDIT_COMMENT_ERROR,
  GOT_BOARD_ERROR,
  GOT_BOARD_MINIATURES_ERROR,
  MOVE_LIST_ERROR,
  MOVE_TASK_ERROR,
  REMOVE_ATTACHMENT_ERROR,
  REMOVE_VIEWER_ERROR,
  RENAMED_BOARD_ERROR,
  RENAMED_LIST_ERROR,
  RENAMED_TASK_ERROR,
  UNSUB_BOARD_ERROR,
} from "../actions/constants";
import * as listActions from "../actions/listActions";
import * as taskActions from "../actions/taskActions";
import { IAlert } from "../entities/IAlert";
import { IState } from "../store/storeStateInterface";

type alertErrorEpicInputActions =
  | ActionType<typeof boardActions.createdBoardError>
  | ActionType<typeof boardActions.deletedBoardError>
  | ActionType<typeof boardActions.gotBoardError>
  | ActionType<typeof boardActions.gotBoardMiniaturesError>
  | ActionType<typeof boardActions.renamedBoardError>
  | ActionType<typeof boardActions.addViewerError>
  | ActionType<typeof boardActions.removeViewerError>
  | ActionType<typeof boardActions.unsubBoardError>
  | ActionType<typeof listActions.createdListError>
  | ActionType<typeof listActions.deletedListError>
  | ActionType<typeof listActions.renamedListError>
  | ActionType<typeof taskActions.createdTaskError>
  | ActionType<typeof taskActions.deletedTaskError>
  | ActionType<typeof taskActions.renamedTaskError>
  | ActionType<typeof taskActions.changedTaskDescriptionError>
  | ActionType<typeof listActions.moveListError>
  | ActionType<typeof taskActions.moveTaskError>
  | ActionType<typeof taskActions.addAttachmentError>
  | ActionType<typeof taskActions.deleteAttachmentError>
  | ActionType<typeof taskActions.addCommentError>
  | ActionType<typeof taskActions.editCommentError>
  | ActionType<typeof taskActions.deleteCommentError>
  | ActionType<typeof alertActions.showAlert>;

type errorActions =
  | ActionType<typeof boardActions.createdBoardError>
  | ActionType<typeof boardActions.deletedBoardError>
  | ActionType<typeof boardActions.gotBoardError>
  | ActionType<typeof boardActions.gotBoardMiniaturesError>
  | ActionType<typeof boardActions.renamedBoardError>
  | ActionType<typeof boardActions.addViewerError>
  | ActionType<typeof boardActions.removeViewerError>
  | ActionType<typeof boardActions.unsubBoardError>
  | ActionType<typeof listActions.createdListError>
  | ActionType<typeof listActions.deletedListError>
  | ActionType<typeof listActions.renamedListError>
  | ActionType<typeof taskActions.createdTaskError>
  | ActionType<typeof taskActions.deletedTaskError>
  | ActionType<typeof taskActions.renamedTaskError>
  | ActionType<typeof taskActions.changedTaskDescriptionError>
  | ActionType<typeof listActions.moveListError>
  | ActionType<typeof taskActions.moveTaskError>
  | ActionType<typeof taskActions.addAttachmentError>
  | ActionType<typeof taskActions.deleteAttachmentError>
  | ActionType<typeof taskActions.addCommentError>
  | ActionType<typeof taskActions.editCommentError>
  | ActionType<typeof taskActions.deleteCommentError>;

type alertErrorEpicOutputActions = ActionType<typeof alertActions.showAlert>;

export const alertErrorEpic: Epic<
  alertErrorEpicInputActions,
  alertErrorEpicOutputActions,
  IState
> = (
  action$: ActionsObservable<alertErrorEpicInputActions>
): Observable<alertErrorEpicOutputActions> => {
  return action$.pipe(
    ofType(
      CREATED_BOARD_ERROR,
      DELETED_BOARD_ERROR,
      GOT_BOARD_ERROR,
      GOT_BOARD_MINIATURES_ERROR,
      RENAMED_BOARD_ERROR,
      CREATED_LIST_ERROR,
      DELETED_LIST_ERROR,
      RENAMED_LIST_ERROR,
      CREATED_TASK_ERROR,
      DELETED_TASK_ERROR,
      RENAMED_TASK_ERROR,
      CHANGED_TASK_DESCRIPTION_ERROR,
      MOVE_LIST_ERROR,
      MOVE_TASK_ERROR,
      REMOVE_VIEWER_ERROR,
      ADD_VIEWER_ERROR,
      UNSUB_BOARD_ERROR,
      ADD_ATTACHMENT_ERROR,
      REMOVE_ATTACHMENT_ERROR,
      ADD_COMMENT_ERROR,
      EDIT_COMMENT_ERROR,
      DELETE_COMMENT_ERROR
    ),
    map((action: errorActions) => {
      const alert: IAlert = {
        color: "w3-red",
        duration: 5000,
        text: action.payload.message,
      };

      return alertActions.showAlert(alert);
    })
  );
};
