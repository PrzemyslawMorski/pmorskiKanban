import {Action} from "redux";
import {ActionsObservable, Epic, ofType, StateObservable} from "redux-observable";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {NEW_USER_NAME} from "../actions/constants";
import {userData} from "../actions/userActions";
import {IState} from "../store/storeStateInterface";

export const newUsernameEpic: Epic<Action, Action, IState> = (
  action$: ActionsObservable<Action>,
  state$: StateObservable<IState>,
): Observable<Action> =>
  action$.pipe(
    ofType(NEW_USER_NAME),
    map((value: string) => {
      userData({
        displayName: value,
        email: state$.value.user!.email,
        photoURL: state$.value.user!.photoURL,
        uid: state$.value.user!.uid,
      });
    }),
  );
