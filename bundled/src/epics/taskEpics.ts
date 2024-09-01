import {
  ActionsObservable,
  Epic,
  ofType,
  StateObservable,
} from "redux-observable";
import { from, Observable, of } from "rxjs";
import { catchError, filter, map, mergeMap, switchMap } from "rxjs/operators";
import { ActionType } from "typesafe-actions";
import {
  ADD_ATTACHMENT,
  ADD_COMMENT,
  CHANGE_TASK_DESCRIPTION,
  CREATE_TASK,
  DELETE_COMMENT,
  DELETE_TASK,
  EDIT_COMMENT,
  MOVE_TASK,
  REMOVE_ATTACHMENT,
  RENAME_TASK,
} from "../actions/constants";
import * as taskActions from "../actions/taskActions";
import { IErrorResponse } from "../dtos/error";
import { IMoveTaskLocalRequest } from "../dtos/moveList";
import {
  IAddAttachmentLocalRequest,
  IAddAttachmentRequest,
  IAddCommentRequest,
  IRemoveAttachmentLocalRequest,
  IDeleteAttachmentRequest,
  IDeleteCommentLocalRequest,
  IDeleteCommentRequest,
  IEditCommentLocalRequest,
  IEditCommentRequest,
  IMoveTaskRequest,
  ISetAttachmentUrlRequest,
} from "../dtos/requests";
import {
  IAddAttachmentFinalResponse,
  IAddAttachmentResponse,
  IAddCommentResponse,
  IChangeTaskDescriptionResponse,
  ICreateTaskResponse,
  IRemoveAttachmentResponse,
  IDeleteCommentResponse,
  IDeleteTaskResponse,
  IEditCommentResponse,
  IMoveTaskResponse,
  IRenameTaskResponse,
  ISetAttachmentUrlResponse,
  IUploadAttachmentResponse,
} from "../dtos/responses";
import { uploadFile } from "../services/uploadFileService";
import { IState } from "../store/storeStateInterface";
import { getApp } from "firebase/app";
import { getFunctions, httpsCallable } from "firebase/functions";

type createTaskEpicInputActions =
  | ActionType<typeof taskActions.createTask>
  | ActionType<typeof taskActions.createdTask>
  | ActionType<typeof taskActions.createdTaskError>;
type createTaskEpicOutputActions =
  | ActionType<typeof taskActions.createdTask>
  | ActionType<typeof taskActions.createdTaskError>;

export const createTaskEpic: Epic<
  createTaskEpicInputActions,
  createTaskEpicOutputActions,
  IState
> = (
  action$: ActionsObservable<createTaskEpicInputActions>,
  state$: StateObservable<IState>
): Observable<createTaskEpicOutputActions> => {
  return action$.pipe(
    ofType(CREATE_TASK),
    filter((action: ActionType<typeof taskActions.createTask>) => {
      return (
        action.payload.boardId !== "" &&
        action.payload.listId !== "" &&
        action.payload.taskName !== "" &&
        state$.value.user !== null &&
        state$.value.board!.owner
      );
    }),
    mergeMap((action: ActionType<typeof taskActions.createTask>) =>
      from(
        httpsCallable(
          getFunctions(getApp()),
          "createTask"
        )({
          boardId: action.payload.boardId,
          listId: action.payload.listId,
          taskName: action.payload.taskName,
        })
      ).pipe(
        catchError((err) => of(err)),
        map((response: any) => {
          if (response.data !== undefined) {
            const successResponse = response.data as ICreateTaskResponse;
            return taskActions.createdTask(
              successResponse.boardId,
              successResponse.listId,
              successResponse.task
            );
          } else {
            const errorResponse = response as IErrorResponse;
            return taskActions.createdTaskError(
              action.payload.boardId,
              action.payload.listId,
              errorResponse.message
            );
          }
        })
      )
    )
  );
};

type deleteTaskEpicInputActions =
  | ActionType<typeof taskActions.deleteTask>
  | ActionType<typeof taskActions.deletedTask>
  | ActionType<typeof taskActions.deletedTaskError>;
type deleteTaskEpicOutputActions =
  | ActionType<typeof taskActions.deletedTask>
  | ActionType<typeof taskActions.deletedTaskError>;

export const deleteTaskEpic: Epic<
  deleteTaskEpicInputActions,
  deleteTaskEpicOutputActions,
  IState
> = (
  action$: ActionsObservable<deleteTaskEpicInputActions>,
  state$: StateObservable<IState>
): Observable<deleteTaskEpicOutputActions> => {
  return action$.pipe(
    ofType(DELETE_TASK),
    filter((action: ActionType<typeof taskActions.deleteTask>) => {
      return (
        action.payload.boardId !== "" &&
        action.payload.listId !== "" &&
        action.payload.taskId !== "" &&
        state$.value.user !== null &&
        state$.value.board!.owner
      );
    }),
    mergeMap((action: ActionType<typeof taskActions.deleteTask>) =>
      from(
        httpsCallable(
          getFunctions(getApp()),
          "deleteTask"
        )({
          boardId: action.payload.boardId,
          listId: action.payload.listId,
          taskId: action.payload.taskId,
        })
      ).pipe(
        catchError((err) => of(err)),
        map((response: any) => {
          if (response.data !== undefined) {
            const successResponse = response.data as IDeleteTaskResponse;
            return taskActions.deletedTask(
              successResponse.boardId,
              successResponse.listId,
              successResponse.taskId
            );
          } else {
            const errorResponse = response as IErrorResponse;
            return taskActions.deletedTaskError(
              action.payload.boardId,
              action.payload.listId,
              action.payload.taskId,
              errorResponse.message
            );
          }
        })
      )
    )
  );
};

type renameTaskEpicInputActions =
  | ActionType<typeof taskActions.renameTask>
  | ActionType<
      | typeof taskActions.renamedTask
      | ActionType<typeof taskActions.renamedTaskError>
    >;
type renameTaskEpicOutputActions = ActionType<
  | typeof taskActions.renamedTask
  | ActionType<typeof taskActions.renamedTaskError>
>;

export const renameTaskEpic: Epic<
  renameTaskEpicInputActions,
  renameTaskEpicOutputActions,
  IState
> = (
  action$: ActionsObservable<renameTaskEpicInputActions>
): Observable<renameTaskEpicOutputActions> => {
  return action$.pipe(
    ofType(RENAME_TASK),
    mergeMap((action: ActionType<typeof taskActions.renameTask>) =>
      from(
        httpsCallable(
          getFunctions(getApp()),
          "renameTask"
        )({
          boardId: action.payload.boardId,
          listId: action.payload.listId,
          newTaskName: action.payload.newTaskName,
          taskId: action.payload.taskId,
        })
      ).pipe(
        catchError((err) => of(err)),
        map((response: any) => {
          if (response.data !== undefined) {
            const successResponse = response.data as IRenameTaskResponse;
            return taskActions.renamedTask(
              successResponse.boardId,
              successResponse.listId,
              successResponse.taskId,
              successResponse.newTaskName
            );
          } else {
            const errorResponse = response as IErrorResponse;
            return taskActions.renamedTaskError(
              action.payload.boardId,
              action.payload.listId,
              action.payload.taskId,
              action.payload.oldTaskName,
              errorResponse.message
            );
          }
        })
      )
    )
  );
};

type changeTaskDescriptionEpicInputActions =
  | ActionType<typeof taskActions.changeTaskDescription>
  | ActionType<
      | typeof taskActions.changedTaskDescription
      | ActionType<typeof taskActions.changedTaskDescriptionError>
    >;
type changeTaskDescriptionEpicOutputActions = ActionType<
  | typeof taskActions.changedTaskDescription
  | ActionType<typeof taskActions.changedTaskDescriptionError>
>;

export const changeTaskDescriptionEpic: Epic<
  changeTaskDescriptionEpicInputActions,
  changeTaskDescriptionEpicOutputActions,
  IState
> = (
  action$: ActionsObservable<changeTaskDescriptionEpicInputActions>
): Observable<changeTaskDescriptionEpicOutputActions> => {
  return action$.pipe(
    ofType(CHANGE_TASK_DESCRIPTION),
    mergeMap((action: ActionType<typeof taskActions.changeTaskDescription>) =>
      from(
        httpsCallable(
          getFunctions(getApp()),
          "changeTaskDescription"
        )({
          boardId: action.payload.boardId,
          listId: action.payload.listId,
          newTaskDescription: action.payload.newTaskDescription,
          taskId: action.payload.taskId,
        })
      ).pipe(
        catchError((err) => of(err)),
        map((response: any) => {
          if (response.data !== undefined) {
            const successResponse =
              response.data as IChangeTaskDescriptionResponse;
            return taskActions.changedTaskDescription(
              successResponse.boardId,
              successResponse.listId,
              successResponse.taskId,
              successResponse.newTaskDescription
            );
          } else {
            const errorResponse = response as IErrorResponse;
            return taskActions.changedTaskDescriptionError(
              action.payload.boardId,
              action.payload.listId,
              action.payload.taskId,
              action.payload.oldTaskDescription,
              errorResponse.message
            );
          }
        })
      )
    )
  );
};

type moveTaskEpicInputActions =
  | ActionType<typeof taskActions.moveTask>
  | ActionType<typeof taskActions.moveTaskSuccess>
  | ActionType<typeof taskActions.moveTaskError>;
type moveTaskEpicOutputActions =
  | ActionType<typeof taskActions.moveTaskSuccess>
  | ActionType<typeof taskActions.moveTaskError>;

export const moveTaskEpic: Epic<
  moveTaskEpicInputActions,
  moveTaskEpicOutputActions,
  IState
> = (
  action$: ActionsObservable<moveTaskEpicInputActions>,
  state$: StateObservable<IState>
): Observable<moveTaskEpicOutputActions> => {
  return action$.pipe(
    ofType(MOVE_TASK),
    filter((action: ActionType<typeof taskActions.moveTask>) => {
      return (
        action.payload.boardId !== "" &&
        action.payload.listId !== "" &&
        state$.value.user !== null &&
        state$.value.board!.owner
      );
    }),
    mergeMap((action: ActionType<typeof taskActions.moveTask>) => {
      const request: IMoveTaskRequest = {
        boardId: action.payload.boardId,
        listId: action.payload.listId,
        srcNextTaskId: action.payload.srcNextTaskId,
        srcPrevTaskId: action.payload.srcPrevTaskId,
        targetListId: action.payload.targetListId,
        targetNextTaskId: action.payload.targetNextTaskId,
        targetPrevTaskId: action.payload.targetPrevTaskId,
        taskId: action.payload.taskId,
      };
      return from(
        httpsCallable(getFunctions(getApp()), "moveTask")(request)
      ).pipe(
        catchError((err) => of(err)),
        map((response: any) => {
          if (response.data !== undefined) {
            const successResponse = response.data as IMoveTaskResponse;
            return taskActions.moveTaskSuccess(successResponse);
          } else {
            const errorResponse: IMoveTaskLocalRequest & IErrorResponse = {
              ...action.payload,
              code: response.code,
              message: response.message,
            };
            return taskActions.moveTaskError(errorResponse);
          }
        })
      );
    })
  );
};

type addAttachmentEpicInputActions =
  | ActionType<typeof taskActions.addAttachment>
  | ActionType<typeof taskActions.addAttachmentSuccess>
  | ActionType<typeof taskActions.addAttachmentError>;
type addAttachmentEpicOutputActions =
  | ActionType<typeof taskActions.addAttachmentSuccess>
  | ActionType<typeof taskActions.addAttachmentError>;

export const addAttachmentEpic: Epic<
  addAttachmentEpicInputActions,
  addAttachmentEpicOutputActions,
  IState
> = (
  action$: ActionsObservable<addAttachmentEpicInputActions>
): Observable<addAttachmentEpicOutputActions> => {
  return action$.pipe(
    ofType(ADD_ATTACHMENT),
    switchMap((action: ActionType<typeof taskActions.addAttachment>) => {
      const addAttachmentRequest: IAddAttachmentRequest = {
        boardId: action.payload.boardId,
        listId: action.payload.listId,
        name: action.payload.attachment.name,
        taskId: action.payload.taskId,
      };
      return from(
        httpsCallable(
          getFunctions(getApp()),
          "addAttachment"
        )(addAttachmentRequest)
      ).pipe(
        catchError((err) => of(err)),
        map((response) => [response, action])
      );
    }),
    switchMap(([addAttachmentResponse, action]) => {
      if (addAttachmentResponse.data !== undefined) {
        const addAttachmentSuccess =
          addAttachmentResponse.data as IAddAttachmentResponse;
        return uploadFile(
          action.payload.attachment,
          addAttachmentSuccess.attachmentId
        ).pipe(
          catchError((err) => of(err)),
          map((response) => [response, action])
        );
      } else {
        return [addAttachmentResponse, action];
      }
    }),
    switchMap(([uploadFileResponse, action]) => {
      if (uploadFileResponse.data !== undefined) {
        const successUploadAttachment =
          uploadFileResponse.data as IUploadAttachmentResponse;
        const setUrlRequest: ISetAttachmentUrlRequest = {
          attachmentId: successUploadAttachment.attachmentId,
          boardId: action.payload.boardId,
          listId: action.payload.listId,
          taskId: action.payload.taskId,
          url: successUploadAttachment.url,
        };
        return from(
          httpsCallable(
            getFunctions(getApp()),
            "setAttachmentUrl"
          )(setUrlRequest)
        ).pipe(
          catchError((err) => of(err)),
          map((response) => [response, action])
        );
      } else {
        return [uploadFileResponse, action];
      }
    }),
    map(([setAttachmentUrlResponse, action]) => {
      if (setAttachmentUrlResponse.data !== undefined) {
        const addAttachmentSuccess =
          setAttachmentUrlResponse.data as ISetAttachmentUrlResponse;
        const final: IAddAttachmentFinalResponse = {
          attachment: addAttachmentSuccess.attachment,
        };
        return taskActions.addAttachmentSuccess(final);
      } else {
        const errorResponse: IAddAttachmentLocalRequest & IErrorResponse = {
          ...action.payload,
          code: setAttachmentUrlResponse.code,
          message: setAttachmentUrlResponse.message,
        };
        return taskActions.addAttachmentError(errorResponse);
      }
    })
  );
};

type deleteAttachmentEpicInputActions =
  | ActionType<typeof taskActions.deleteAttachment>
  | ActionType<typeof taskActions.deleteAttachmentSuccess>
  | ActionType<typeof taskActions.deleteAttachmentError>;
type deleteAttachmentEpicOutputActions =
  | ActionType<typeof taskActions.deleteAttachmentSuccess>
  | ActionType<typeof taskActions.deleteAttachmentError>;

export const deleteAttachmentEpic: Epic<
  deleteAttachmentEpicInputActions,
  deleteAttachmentEpicOutputActions,
  IState
> = (
  action$: ActionsObservable<deleteAttachmentEpicInputActions>
): Observable<deleteAttachmentEpicOutputActions> => {
  return action$.pipe(
    ofType(REMOVE_ATTACHMENT),
    mergeMap((action: ActionType<typeof taskActions.deleteAttachment>) => {
      const request: IDeleteAttachmentRequest = {
        attachmentId: action.payload.attachment.id,
        boardId: action.payload.boardId,
        listId: action.payload.listId,
        taskId: action.payload.taskId,
      };
      return from(
        httpsCallable(getFunctions(getApp()), "removeAttachment")(request)
      ).pipe(
        catchError((err) => of(err)),
        map((response: any) => {
          if (response.data !== undefined) {
            const successResponse = response.data as IRemoveAttachmentResponse;
            return taskActions.deleteAttachmentSuccess(successResponse);
          } else {
            const errorResponse: IRemoveAttachmentLocalRequest &
              IErrorResponse = {
              ...action.payload,
              code: response.code,
              message: response.message,
            };
            return taskActions.deleteAttachmentError(errorResponse);
          }
        })
      );
    })
  );
};

type addCommentEpicInputActions =
  | ActionType<typeof taskActions.addComment>
  | ActionType<typeof taskActions.addCommentSuccess>
  | ActionType<typeof taskActions.addCommentError>;
type addCommentEpicOutputActions =
  | ActionType<typeof taskActions.addCommentSuccess>
  | ActionType<typeof taskActions.addCommentError>;

export const addCommentEpic: Epic<
  addCommentEpicInputActions,
  addCommentEpicOutputActions,
  IState
> = (
  action$: ActionsObservable<addCommentEpicInputActions>
): Observable<addCommentEpicOutputActions> => {
  return action$.pipe(
    ofType(ADD_COMMENT),
    mergeMap((action: ActionType<typeof taskActions.addComment>) => {
      const request: IAddCommentRequest = {
        boardId: action.payload.boardId,
        content: action.payload.content,
        listId: action.payload.listId,
        taskId: action.payload.taskId,
      };

      return from(
        httpsCallable(getFunctions(getApp()), "addComment")(request)
      ).pipe(
        catchError((err) => of(err)),
        map((response: any) => {
          if (response.data !== undefined) {
            const successResponse = response.data as IAddCommentResponse;
            return taskActions.addCommentSuccess(successResponse);
          } else {
            const errorResponse: IAddCommentRequest & IErrorResponse = {
              ...request,
              code: response.code,
              message: response.message,
            };
            return taskActions.addCommentError(errorResponse);
          }
        })
      );
    })
  );
};

type editCommentEpicInputActions =
  | ActionType<typeof taskActions.editComment>
  | ActionType<typeof taskActions.editCommentSuccess>
  | ActionType<typeof taskActions.editCommentError>;
type editCommentEpicOutputActions =
  | ActionType<typeof taskActions.editCommentSuccess>
  | ActionType<typeof taskActions.editCommentError>;

export const editCommentEpic: Epic<
  editCommentEpicInputActions,
  editCommentEpicOutputActions,
  IState
> = (
  action$: ActionsObservable<editCommentEpicInputActions>
): Observable<editCommentEpicOutputActions> => {
  return action$.pipe(
    ofType(EDIT_COMMENT),
    mergeMap((action: ActionType<typeof taskActions.editComment>) => {
      const request: IEditCommentRequest = {
        boardId: action.payload.comment.boardId,
        commentId: action.payload.comment.id,
        listId: action.payload.comment.listId,
        newContent: action.payload.newContent,
        taskId: action.payload.comment.taskId,
      };
      return from(
        httpsCallable(getFunctions(getApp()), "editComment")(request)
      ).pipe(
        catchError((err) => of(err)),
        map((response: any) => {
          if (response.data !== undefined) {
            const successResponse = response.data as IEditCommentResponse;
            return taskActions.editCommentSuccess(successResponse);
          } else {
            const errorResponse: IEditCommentLocalRequest & IErrorResponse = {
              ...action.payload,
              code: response.code,
              message: response.message,
            };
            return taskActions.editCommentError(errorResponse);
          }
        })
      );
    })
  );
};

type deleteCommentEpicInputActions =
  | ActionType<typeof taskActions.deleteComment>
  | ActionType<typeof taskActions.deleteCommentSuccess>
  | ActionType<typeof taskActions.deleteCommentError>;
type deleteCommentEpicOutputActions =
  | ActionType<typeof taskActions.deleteCommentSuccess>
  | ActionType<typeof taskActions.deleteCommentError>;

export const deleteCommentEpic: Epic<
  deleteCommentEpicInputActions,
  deleteCommentEpicOutputActions,
  IState
> = (
  action$: ActionsObservable<deleteCommentEpicInputActions>
): Observable<deleteCommentEpicOutputActions> => {
  return action$.pipe(
    ofType(DELETE_COMMENT),
    mergeMap((action: ActionType<typeof taskActions.deleteComment>) => {
      const request: IDeleteCommentRequest = {
        boardId: action.payload.comment.boardId,
        commentId: action.payload.comment.id,
        listId: action.payload.comment.listId,
        taskId: action.payload.comment.taskId,
      };
      return from(
        httpsCallable(getFunctions(getApp()), "deleteComment")(request)
      ).pipe(
        catchError((err) => of(err)),
        map((response: any) => {
          if (response.data !== undefined) {
            const successResponse = response.data as IDeleteCommentResponse;
            return taskActions.deleteCommentSuccess(successResponse);
          } else {
            const errorResponse: IDeleteCommentLocalRequest & IErrorResponse = {
              ...action.payload,
              code: response.code,
              message: response.message,
            };
            return taskActions.deleteCommentError(errorResponse);
          }
        })
      );
    })
  );
};
