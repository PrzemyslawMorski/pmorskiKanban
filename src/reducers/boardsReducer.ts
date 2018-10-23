import {Reducer} from "redux";
import {ActionType} from "typesafe-actions";
import * as boardsActions from "../actions/boardActions";
import {BOARD_MINIATURES} from "../actions/constants";
import {IBoardMiniature} from "../entities/IBoard";
import {initialStoreState} from "../store/initialStoreState";

type actions = ActionType<typeof boardsActions.boardMiniatures>;

export const boardsReducer: Reducer<IBoardMiniature[], actions> = (
  state: IBoardMiniature[] = initialStoreState.boards,
  action: actions,
) => {
  switch (action.type) {
    case BOARD_MINIATURES:
      return action.payload;
    default:
      return state;
  }
};
