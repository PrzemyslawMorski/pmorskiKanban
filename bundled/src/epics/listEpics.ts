import * as firebase from "firebase";
import {
  ActionsObservable,
  Epic,
  ofType,
  StateObservable,
} from "redux-observable";
import { from, Observable, of } from "rxjs";
import { catchError, filter, map, mergeMap } from "rxjs/operators";
import { ActionType } from "typesafe-actions";
import {
  CREATE_LIST,
  DELETE_LIST,
  MOVE_LIST,
  RENAME_LIST,
} from "../actions/constants";
import * as listActions from "../actions/listActions";
import { IErrorResponse } from "../dtos/error";
import { IMoveListLocalRequest } from "../dtos/moveList";
import { IMoveListRequest } from "../dtos/requests";
import {
  ICreateListResponse,
  IDeleteListResponse,
  IMoveListResponse,
  IRenameListResponse,
} from "../dtos/responses";
import { IState } from "../store/storeStateInterface";

type createListEpicInputActions =
  | ActionType<typeof listActions.createList>
  | ActionType<typeof listActions.createdList>;
type createListEpicOutputActions = ActionType<typeof listActions.createdList>;

export const createListEpic: Epic<
  createListEpicInputActions,
  createListEpicOutputActions,
  IState
> = (
  action$: ActionsObservable<createListEpicInputActions>,
  state$: StateObservable<IState>
): Observable<createListEpicOutputActions> => {
  return action$.pipe(
    ofType(CREATE_LIST),
    filter((action: ActionType<typeof listActions.createList>) => {
      return (
        action.payload.boardId !== "" &&
        action.payload.listName !== "" &&
        state$.value.user !== null &&
        state$.value.board!.owner
      );
    }),
    mergeMap((action: ActionType<typeof listActions.createList>) =>
      from(
        firebase.functions().httpsCallable("createList")({
          boardId: action.payload.boardId,
          listName: action.payload.listName,
        })
      ).pipe(
        catchError((err) => of(err)),
        map((response: any) => {
          if (response.data !== undefined) {
            const successResponse = response.data as ICreateListResponse;
            return listActions.createdList(
              successResponse.boardId,
              successResponse.newList
            );
          } else {
            const errorResponse = response as IErrorResponse;
            return listActions.createdListError(
              action.payload.boardId,
              errorResponse.message
            );
          }
        })
      )
    )
  );
};

type renameListEpicInputActions =
  | ActionType<typeof listActions.renameList>
  | ActionType<typeof listActions.renamedList>;
type renameListEpicOutputActions = ActionType<typeof listActions.renamedList>;

export const renameListEpic: Epic<
  renameListEpicInputActions,
  renameListEpicOutputActions,
  IState
> = (
  action$: ActionsObservable<renameListEpicInputActions>
): Observable<renameListEpicOutputActions> => {
  return action$.pipe(
    ofType(RENAME_LIST),
    mergeMap((action: ActionType<typeof listActions.renameList>) =>
      from(
        firebase.functions().httpsCallable("renameList")({
          boardId: action.payload.boardId,
          listId: action.payload.listId,
          listName: action.payload.newListName,
        })
      ).pipe(
        catchError((err) => of(err)),
        map((response: any) => {
          if (response.data !== undefined) {
            const successResponse = response.data as IRenameListResponse;
            return listActions.renamedList(
              successResponse.boardId,
              successResponse.listId,
              successResponse.newListName
            );
          } else {
            const errorResponse = response as IErrorResponse;
            return listActions.renamedListError(
              action.payload.boardId,
              action.payload.listId,
              action.payload.oldListName,
              errorResponse.message
            );
          }
        })
      )
    )
  );
};

type deleteListEpicInputActions =
  | ActionType<typeof listActions.deleteList>
  | ActionType<typeof listActions.deletedList>;
type deleteListEpicOutputActions = ActionType<typeof listActions.deletedList>;

export const deleteListEpic: Epic<
  deleteListEpicInputActions,
  deleteListEpicOutputActions,
  IState
> = (
  action$: ActionsObservable<deleteListEpicInputActions>,
  state$: StateObservable<IState>
): Observable<deleteListEpicOutputActions> => {
  return action$.pipe(
    ofType(DELETE_LIST),
    filter((action: ActionType<typeof listActions.deleteList>) => {
      return (
        action.payload.boardId !== "" &&
        action.payload.listId !== "" &&
        state$.value.user !== null &&
        state$.value.board!.owner
      );
    }),
    mergeMap((action: ActionType<typeof listActions.deleteList>) =>
      from(
        firebase.functions().httpsCallable("deleteList")({
          boardId: action.payload.boardId,
          listId: action.payload.listId,
        })
      ).pipe(
        catchError((err) => of(err)),
        map((response: any) => {
          if (response.data !== undefined) {
            const successResponse = response.data as IDeleteListResponse;
            return listActions.deletedList(
              successResponse.boardId,
              successResponse.listId
            );
          } else {
            const errorResponse = response as IErrorResponse;
            return listActions.deletedListError(
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

type moveListEpicInputActions =
  | ActionType<typeof listActions.moveList>
  | ActionType<typeof listActions.moveListSuccess>
  | ActionType<typeof listActions.moveListError>;
type moveListEpicOutputActions =
  | ActionType<typeof listActions.moveListSuccess>
  | ActionType<typeof listActions.moveListError>;

export const moveListEpic: Epic<
  moveListEpicInputActions,
  moveListEpicOutputActions,
  IState
> = (
  action$: ActionsObservable<moveListEpicInputActions>,
  state$: StateObservable<IState>
): Observable<moveListEpicOutputActions> => {
  return action$.pipe(
    ofType(MOVE_LIST),
    filter((action: ActionType<typeof listActions.moveList>) => {
      return (
        action.payload.boardId !== "" &&
        action.payload.listId !== "" &&
        state$.value.user !== null &&
        state$.value.board!.owner
      );
    }),
    mergeMap((action: ActionType<typeof listActions.moveList>) => {
      const request: IMoveListRequest = {
        boardId: action.payload.boardId,
        listId: action.payload.listId,
        srcNextListId: action.payload.srcNextListId,
        srcPrevListId: action.payload.srcPrevListId,
        targetNextListId: action.payload.targetNextListId,
        targetPrevListId: action.payload.targetPrevListId,
      };
      return from(firebase.functions().httpsCallable("moveList")(request)).pipe(
        catchError((err) => of(err)),
        map((response: any) => {
          if (response.data !== undefined) {
            const successResponse = response.data as IMoveListResponse;
            return listActions.moveListSuccess(successResponse);
          } else {
            const errorResponse: IMoveListLocalRequest & IErrorResponse = {
              ...action.payload,
              code: response.code,
              message: response.message,
            };
            return listActions.moveListError(errorResponse);
          }
        })
      );
    })
  );
};
