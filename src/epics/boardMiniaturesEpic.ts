import * as firebase from "firebase";
import {Action} from "redux";
import {ActionsObservable, Epic, ofType, StateObservable} from "redux-observable";
import {from, Observable} from "rxjs";
import {filter, map, mergeMap} from "rxjs/operators";
import {boardMiniatures} from "../actions/boardActions";
import {USER_DATA} from "../actions/constants";
import {IBoardMiniature} from "../entities/IBoard";
import {IState} from "../store/storeStateInterface";

export const boardMiniaturesEpic: Epic<Action, Action, IState> = (
  action$: ActionsObservable<Action>,
  state$: StateObservable<IState>,
): Observable<Action> => {
  return action$.pipe(
    ofType(USER_DATA),
    filter(() => state$.value.user !== null),
    mergeMap(() => {
      debugger;
      return from(firebase.functions().httpsCallable("getBoardMiniatures")(state$.value.user!.uid)).pipe(
        map((response: any) => {
          debugger;
          return response.data.then((boards: IBoardMiniature[]) => boardMiniatures(boards));
        }),
      );
    }),
  );
};
