import { Reducer } from "redux";
import { ActionType } from "typesafe-actions";
import * as boardsActions from "../actions/boardActions";
import {
  CREATED_BOARD,
  DELETE_BOARD,
  DELETED_BOARD,
  DELETED_BOARD_ERROR,
  GOT_BOARD_MINIATURES,
  RENAMED_BOARD,
  UNSUB_BOARD,
  UNSUB_BOARD_ERROR,
  UNSUB_BOARD_SUCCESS,
} from "../actions/constants";
import { IErrorResponse } from "../dtos/error";
import { IBoardMiniature } from "../entities/IBoardMiniature";
import { initialStoreState } from "../store/initialStoreState";
import {
  IDeleteBoardLocalRequest,
  IUnsubBoardLocalRequest,
} from "../dtos/local-requests";

type actions =
  | ActionType<typeof boardsActions.gotBoardMiniatures>
  | ActionType<typeof boardsActions.createdBoard>
  | ActionType<typeof boardsActions.deletedBoard>
  | ActionType<typeof boardsActions.deleteBoard>
  | ActionType<typeof boardsActions.deletedBoardError>
  | ActionType<typeof boardsActions.renamedBoard>
  | ActionType<typeof boardsActions.unsubBoard>
  | ActionType<typeof boardsActions.unsubBoardSuccess>
  | ActionType<typeof boardsActions.unsubBoardError>;

function sortBoardMiniaturesByName(
  boardMiniatures: IBoardMiniature[]
): IBoardMiniature[] {
  return boardMiniatures.sort((boardMin1, boardMin2) =>
    boardMin1.name.toLowerCase() > boardMin2.name.toLowerCase()
      ? 1
      : boardMin1.name.toLowerCase() === boardMin2.name.toLowerCase()
      ? 0
      : -1
  );
}

function handleUnsubBoard(
  state: IBoardMiniature[] | null,
  request: IUnsubBoardLocalRequest
) {
  if (state === null) {
    return [];
  }

  const indexOfUnsubbedBoard = state.indexOf(request.board);
  if (indexOfUnsubbedBoard === -1) {
    // already unsubbed
    return state;
  }

  let newState = state.slice(0, state.length);
  newState.splice(indexOfUnsubbedBoard, 1);
  newState = sortBoardMiniaturesByName(newState);

  return newState;
}

function handleUnsubBoardSuccess(state: IBoardMiniature[] | null) {
  if (state === null) {
    return [];
  }
  return state;
}

function handleUnsubBoardError(
  state: IBoardMiniature[] | null,
  response: IUnsubBoardLocalRequest & IErrorResponse
) {
  if (state === null) {
    return [];
  }

  const indexOfUnsubbedBoard = state.indexOf(response.board);
  if (indexOfUnsubbedBoard !== -1) {
    // already fixed - is subbed
    return state;
  }

  let newState = state.slice();
  newState.push(response.board);
  newState = sortBoardMiniaturesByName(newState);

  return newState;
}

function handleDeleteBoard(
  state: IBoardMiniature[] | null,
  request: IDeleteBoardLocalRequest
) {
  if (state === null) {
    return [];
  }

  const indexOfDeletedBoard = state.indexOf(request.board);
  if (indexOfDeletedBoard === -1) {
    // already deleted
    return state;
  }

  let newState = state.slice(0, state.length);
  newState.splice(indexOfDeletedBoard, 1);
  newState = sortBoardMiniaturesByName(newState);
  return newState;
}

function handleDeletedBoard(state: IBoardMiniature[] | null) {
  if (state === null) {
    return [];
  }
  return state;
}

function handleDeletedBoardError(
  state: IBoardMiniature[] | null,
  response: IDeleteBoardLocalRequest & IErrorResponse
) {
  if (state === null) {
    return [];
  }

  const indexOfDeletedBoard = state.indexOf(response.board);
  if (indexOfDeletedBoard !== -1) {
    // already fixed - is owned
    return state;
  }

  let newState = state.slice();
  newState.push(response.board);
  newState = sortBoardMiniaturesByName(newState);

  return newState;
}

export const boardMiniaturesReducer: Reducer<
  IBoardMiniature[] | null,
  actions
> = (
  state: IBoardMiniature[] | null = initialStoreState.boards,
  action: actions
) => {
  switch (action.type) {
    case GOT_BOARD_MINIATURES:
      return sortBoardMiniaturesByName(action.payload.boards);
    case CREATED_BOARD:
      if (state === null) {
        return [];
      }
      const createdBoardNewBoardMiniatures = state;

      createdBoardNewBoardMiniatures.push({
        id: action.payload.board.id,
        name: action.payload.board.name,
        owner: action.payload.board.owner,
      });

      return sortBoardMiniaturesByName(createdBoardNewBoardMiniatures);

    case DELETE_BOARD:
      return handleDeleteBoard(state, action.payload);

    case DELETED_BOARD:
      return handleDeletedBoard(state);

    case DELETED_BOARD_ERROR:
      return handleDeletedBoardError(state, action.payload);

    case UNSUB_BOARD:
      return handleUnsubBoard(state, action.payload);

    case UNSUB_BOARD_SUCCESS:
      return handleUnsubBoardSuccess(state);

    case UNSUB_BOARD_ERROR:
      return handleUnsubBoardError(state, action.payload);

    case RENAMED_BOARD:
      if (state === null) {
        return [];
      }

      const renamedBoardNewBoardMiniatures = state;

      const renamedBoardIndex = renamedBoardNewBoardMiniatures.findIndex(
        (boardMiniature) => boardMiniature.id === action.payload.boardId
      );

      if (renamedBoardIndex !== -1) {
        renamedBoardNewBoardMiniatures[renamedBoardIndex] = {
          ...renamedBoardNewBoardMiniatures[renamedBoardIndex],
          name: action.payload.boardName,
        };
      }

      return sortBoardMiniaturesByName(renamedBoardNewBoardMiniatures);

    default:
      return state;
  }
};
