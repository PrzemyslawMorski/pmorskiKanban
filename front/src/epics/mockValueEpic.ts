import * as mockValueActions from "../actions/mockValueActions";

import {Action} from "redux";
import {ActionsObservable, Epic, ofType} from "redux-observable";
import {Observable} from "rxjs";
import {map, mergeMap} from "rxjs/operators";
import {ActionType} from "typesafe-actions";
import {LOAD_MOCK_VALUE} from "../actions/constants";
import {MockValueApi} from "../api/mockAuthorApi";

export const mockValueEpic: Epic<Action, Action, void> = (
  action$: ActionsObservable<ActionType<typeof mockValueActions>>,
): Observable<Action> =>
  action$.pipe(
    ofType(LOAD_MOCK_VALUE),
    mergeMap(() =>
      MockValueApi.getValue().pipe(map((mockValue: string) => mockValueActions.mockValueLoaded(mockValue))),
    ),
  );
