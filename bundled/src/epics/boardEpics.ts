import { Epic, ofType, StateObservable } from "redux-observable";
import { from, Observable, of } from "rxjs";
import { catchError, filter, map, mergeMap } from "rxjs/operators";
import { ActionType } from "typesafe-actions";
import * as boardActions from "../actions/boardActions";
import {
  ADD_VIEWER,
  CREATE_BOARD,
  CREATED_BOARD,
  DELETE_BOARD,
  DELETED_BOARD,
  GET_BOARD,
  REMOVE_VIEWER,
  RENAME_BOARD,
} from "../actions/constants";
import { IErrorResponse } from "../dtos/error";
import {
  IAddViewerResponse,
  ICreateBoardResponse,
  IDeleteBoardResponse,
  IGetBoardResponse,
  IRemoveViewerResponse,
  IRenameBoardResponse,
} from "../dtos/responses";
import { IState } from "../store/storeStateInterface";
import { getFunctions, httpsCallable } from "firebase/functions";
import { getApp } from "firebase/app";
import { IAddViewerRequest, IRemoveViewerRequest } from "../dtos/requests";
import { IAddViewerLocalRequest, IDeleteBoardLocalRequest, IDeleteViewerLocalRequest } from "../dtos/local-requests";

type createBoardInputActions =
  | ActionType<typeof boardActions.createBoard>
  | ActionType<typeof boardActions.createdBoard>
  | ActionType<typeof boardActions.createdBoardError>;
type createBoardOutputActions =
  | ActionType<typeof boardActions.createdBoard>
  | ActionType<typeof boardActions.createdBoardError>;

export const createBoardEpic: Epic<
  createBoardInputActions,
  createBoardOutputActions,
  IState
> = (
  action$: ActionsObservable<createBoardInputActions>,
  state$: StateObservable<IState>
): Observable<createBoardOutputActions> => {
  return action$.pipe(
    ofType(CREATE_BOARD),
    filter((action: ActionType<typeof boardActions.createBoard>) => {
      return action.payload.boardName !== "" && state$.value.user !== null;
    }),
    mergeMap((action: ActionType<typeof boardActions.createBoard>) =>
      from(
        httpsCallable(
          getFunctions(getApp()),
          "createBoard"
        )({
          boardName: action.payload.boardName,
        })
      ).pipe(
        catchError((err) => of(err)),
        map((response: any) => {
          if (response.data !== undefined) {
            const successResponse = response.data as ICreateBoardResponse;
            return boardActions.createdBoard(successResponse.newBoard);
          } else {
            const errorResponse = response as IErrorResponse;
            return boardActions.createdBoardError(
              action.payload.boardName,
              errorResponse.message
            );
          }
        })
      )
    )
  );
};

type getCreatedBoardEpicInputActions =
  | ActionType<typeof boardActions.createdBoard>
  | ActionType<typeof boardActions.gotBoard>;
type getCreatedBoardEpicOutputActions = ActionType<
  typeof boardActions.gotBoard
>;

export const getCreatedBoardEpic: Epic<
  getCreatedBoardEpicInputActions,
  getCreatedBoardEpicOutputActions,
  IState
> = (
  action$: ActionsObservable<getCreatedBoardEpicInputActions>
): Observable<getCreatedBoardEpicOutputActions> => {
  return action$.pipe(
    ofType(CREATED_BOARD),
    filter((action: ActionType<typeof boardActions.createdBoard>) => {
      return action.payload.board !== null;
    }),
    map((action: ActionType<typeof boardActions.createdBoard>) => {
      return boardActions.gotBoard(action.payload.board);
    })
  );
};

type getBoardEpicInputActions =
  | ActionType<typeof boardActions.getBoard>
  | ActionType<typeof boardActions.gotBoard>
  | ActionType<typeof boardActions.resetBoard>;
type getBoardEpicOutputActions =
  | ActionType<typeof boardActions.gotBoard>
  | ActionType<typeof boardActions.resetBoard>;

export const getBoardEpic: Epic<
  getBoardEpicInputActions,
  getBoardEpicOutputActions,
  IState
> = (
  action$: ActionsObservable<getBoardEpicInputActions>,
  state$: StateObservable<IState>
): Observable<getBoardEpicOutputActions> => {
  return action$.pipe(
    ofType(GET_BOARD),
    filter((action: ActionType<typeof boardActions.getBoard>) => {
      return (
        action.payload.boardId !== null &&
        action.payload.boardId !== "" &&
        state$.value.user !== null
      );
    }),
    mergeMap((action: ActionType<typeof boardActions.getBoard>) =>
      from(
        httpsCallable(
          getFunctions(getApp()),
          "getBoard"
        )({
          boardId: action.payload.boardId,
        })
      ).pipe(
        catchError((err) => of(err)),
        map((response: any) => {
          if (response.data !== undefined) {
            const successResponse = response.data as IGetBoardResponse;
            return boardActions.gotBoard(successResponse.board);
          } else {
            const errorResponse = response as IErrorResponse;
            return boardActions.gotBoardError(
              action.payload.boardId,
              errorResponse.message
            );
          }
        })
      )
    )
  );
};

type renameBoardEpicInputActions =
  | ActionType<typeof boardActions.renameBoard>
  | ActionType<typeof boardActions.renamedBoard>
  | ActionType<typeof boardActions.renamedBoardError>;
type renameBoardEpicOutputActions =
  | ActionType<typeof boardActions.renamedBoard>
  | ActionType<typeof boardActions.renamedBoardError>;

export const renameBoardEpic: Epic<
  renameBoardEpicInputActions,
  renameBoardEpicOutputActions,
  IState
> = (
  action$: ActionsObservable<renameBoardEpicInputActions>
): Observable<renameBoardEpicOutputActions> => {
  return action$.pipe(
    ofType(RENAME_BOARD),
    mergeMap((action: ActionType<typeof boardActions.renameBoard>) =>
      from(
        httpsCallable(
          getFunctions(getApp()),
          "renameBoard"
        )({
          boardId: action.payload.boardId,
          boardName: action.payload.newBoardName,
        })
      ).pipe(
        catchError((err) => of(err)),
        map((response: any) => {
          if (response.data !== undefined) {
            const successResponse = response.data as IRenameBoardResponse;
            return boardActions.renamedBoard(
              successResponse.boardId,
              successResponse.newBoardName
            );
          } else {
            const errorResponse = response as IErrorResponse;
            return boardActions.renamedBoardError(
              action.payload.boardId,
              action.payload.oldBoardName,
              errorResponse.message
            );
          }
        })
      )
    )
  );
};

type deleteBoardEpicInputActions =
  | ActionType<typeof boardActions.deleteBoard>
  | ActionType<typeof boardActions.deletedBoard>
  | ActionType<typeof boardActions.deletedBoardError>;
type deleteBoardEpicOutputActions =
  | ActionType<typeof boardActions.deletedBoard>
  | ActionType<typeof boardActions.deletedBoardError>;

export const deleteBoardEpic: Epic<
  deleteBoardEpicInputActions,
  deleteBoardEpicOutputActions,
  IState
> = (
  action$: ActionsObservable<deleteBoardEpicInputActions>
): Observable<deleteBoardEpicOutputActions> => {
  return action$.pipe(
    ofType(DELETE_BOARD),
    mergeMap((action: ActionType<typeof boardActions.deleteBoard>) =>
      from(
        httpsCallable(
          getFunctions(getApp()),
          "deleteBoard"
        )({
          boardId: action.payload.board.id,
        })
      ).pipe(
        catchError((err) => of(err)),
        map((response: any) => {
          if (response.data !== undefined) {
            const successResponse = response.data as IDeleteBoardResponse;
            return boardActions.deletedBoard(successResponse);
          } else {
            const errorResponse: IDeleteBoardLocalRequest & IErrorResponse = {
              ...action.payload,
              code: response.code,
              message: response.message,
            };
            return boardActions.deletedBoardError(errorResponse);
          }
        })
      )
    )
  );
};

type resetBoardIfDeletedEpicInputActions =
  | ActionType<typeof boardActions.deletedBoard>
  | ActionType<typeof boardActions.resetBoard>;
type resetBoardIfDeletedEpicOutputActions = ActionType<
  typeof boardActions.resetBoard
>;

export const resetBoardIfDeletedEpic: Epic<
  resetBoardIfDeletedEpicInputActions,
  resetBoardIfDeletedEpicOutputActions,
  IState
> = (
  action$: ActionsObservable<resetBoardIfDeletedEpicInputActions>
): Observable<resetBoardIfDeletedEpicOutputActions> => {
  return action$.pipe(
    ofType(DELETED_BOARD),
    map(() => {
      return boardActions.resetBoard();
    })
  );
};

type removeViewerEpicInputActions =
  | ActionType<typeof boardActions.removeViewer>
  | ActionType<typeof boardActions.removeViewerSuccess>
  | ActionType<typeof boardActions.removeViewerError>;
type removeViewerEpicOutputActions =
  | ActionType<typeof boardActions.removeViewerSuccess>
  | ActionType<typeof boardActions.removeViewerError>;

export const removeViewerEpic: Epic<
  removeViewerEpicInputActions,
  removeViewerEpicOutputActions,
  IState
> = (
  action$: ActionsObservable<removeViewerEpicInputActions>
): Observable<removeViewerEpicOutputActions> => {
  return action$.pipe(
    ofType(REMOVE_VIEWER),
    mergeMap((action: ActionType<typeof boardActions.removeViewer>) => {
      const request: IRemoveViewerRequest = {
        boardId: action.payload.boardId,
        userId: action.payload.user.uid,
      };
      return from(
        httpsCallable(getFunctions(getApp()), "removeViewer")(request)
      ).pipe(
        catchError((err) => of(err)),
        map((response: any) => {
          if (response.data !== undefined) {
            const successResponse = response.data as IRemoveViewerResponse;
            return boardActions.removeViewerSuccess(successResponse);
          } else {
            const errorResponse: IDeleteViewerLocalRequest & IErrorResponse = {
              ...action.payload,
              code: response.code,
              message: response.message,
            };
            return boardActions.removeViewerError(errorResponse);
          }
        })
      );
    })
  );
};

type addViewerEpicInputActions =
  | ActionType<typeof boardActions.addViewer>
  | ActionType<typeof boardActions.addViewerSuccess>
  | ActionType<typeof boardActions.addViewerError>;
type addViewerEpicOutputActions =
  | ActionType<typeof boardActions.addViewerSuccess>
  | ActionType<typeof boardActions.addViewerError>;

export const addViewerEpic: Epic<
  addViewerEpicInputActions,
  addViewerEpicOutputActions,
  IState
> = (
  action$: ActionsObservable<addViewerEpicInputActions>
): Observable<addViewerEpicOutputActions> => {
  return action$.pipe(
    ofType(ADD_VIEWER),
    mergeMap((action: ActionType<typeof boardActions.addViewer>) => {
      const request: IAddViewerRequest = {
        boardId: action.payload.boardId,
        userId: action.payload.user.uid,
      };
      return from(
        httpsCallable(getFunctions(getApp()), "addViewer")(request)
      ).pipe(
        catchError((err) => of(err)),
        map((response: any) => {
          if (response.data !== undefined) {
            const successResponse = response.data as IAddViewerResponse;
            return boardActions.addViewerSuccess(successResponse);
          } else {
            const errorResponse: IAddViewerLocalRequest & IErrorResponse = {
              ...action.payload,
              code: response.code,
              message: response.message,
            };
            return boardActions.addViewerError(errorResponse);
          }
        })
      );
    })
  );
};
