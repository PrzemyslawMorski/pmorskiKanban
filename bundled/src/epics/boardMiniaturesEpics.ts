import { ActionsObservable, Epic, ofType } from "redux-observable";
import { from, Observable, of } from "rxjs";
import { catchError, delay, filter, map, mergeMap } from "rxjs/operators";
import { ActionType } from "typesafe-actions";
import * as boardActions from "../actions/boardActions";
import { UNSUB_BOARD, UPDATE_USER } from "../actions/constants";
import * as userActions from "../actions/userActions";
import { IErrorResponse } from "../dtos/error";
import {
  IGetBoardMiniaturesResponse,
  IUnsubBoardResponse,
} from "../dtos/responses";
import { IBoardMiniature } from "../entities/IBoardMiniature";
import { IState } from "../store/storeStateInterface";
import { getFunctions, httpsCallable } from "firebase/functions";
import { getApp } from "firebase/app";
import { IUnsubBoardRequest } from "../dtos/requests";
import { IUnsubBoardLocalRequest } from "../dtos/local-requests";

export const getBoardMiniaturesOnNewUserDataEpic: Epic<
  | ActionType<typeof userActions.updateUser>
  | ActionType<typeof boardActions.gotBoardMiniatures>,
  ActionType<typeof boardActions.gotBoardMiniatures>,
  IState
> = (
  action$: ActionsObservable<
    | ActionType<typeof userActions.updateUser>
    | ActionType<typeof boardActions.gotBoardMiniatures>
  >
): Observable<ActionType<typeof boardActions.gotBoardMiniatures>> => {
  return action$.pipe(
    ofType(UPDATE_USER),
    filter((action: ActionType<typeof userActions.updateUser>) => {
      return action.payload.user !== null;
    }),
    mergeMap(() => {
      return from(
        httpsCallable(getFunctions(getApp()), "getBoardMiniatures")()
      ).pipe(
        catchError((err) => of(err)),
        map((response: any) => {
          if (response.data !== undefined) {
            const successResponse =
              response.data as IGetBoardMiniaturesResponse;
            return boardActions.gotBoardMiniatures(
              successResponse.boardMiniatures as IBoardMiniature[]
            );
          } else {
            const errorResponse = response as IErrorResponse;
            return boardActions.gotBoardMiniaturesError(errorResponse.message);
          }
        })
      );
    })
  );
};

type unsubBoardEpicInputActions =
  | ActionType<typeof boardActions.unsubBoard>
  | ActionType<typeof boardActions.unsubBoardSuccess>
  | ActionType<typeof boardActions.unsubBoardError>;
type unsubBoardEpicOutputActions =
  | ActionType<typeof boardActions.unsubBoardSuccess>
  | ActionType<typeof boardActions.unsubBoardError>;

export const unsubBoardEpic: Epic<
  unsubBoardEpicInputActions,
  unsubBoardEpicOutputActions,
  IState
> = (
  action$: ActionsObservable<unsubBoardEpicInputActions>
): Observable<unsubBoardEpicOutputActions> => {
  return action$.pipe(
    ofType(UNSUB_BOARD),
    delay(2000),
    mergeMap((action: ActionType<typeof boardActions.unsubBoard>) => {
      const request: IUnsubBoardRequest = {
        boardId: action.payload.board.id,
      };
      return from(
        httpsCallable(getFunctions(getApp()), "unsubBoard")(request)
      ).pipe(
        catchError((err) => of(err)),
        map((response: any) => {
          if (response.data !== undefined) {
            const successResponse = response.data as IUnsubBoardResponse;
            return boardActions.unsubBoardSuccess(successResponse);
          } else {
            const errorResponse: IUnsubBoardLocalRequest & IErrorResponse = {
              ...action.payload,
              code: response.code,
              message: response.message,
            };
            return boardActions.unsubBoardError(errorResponse);
          }
        })
      );
    })
  );
};
