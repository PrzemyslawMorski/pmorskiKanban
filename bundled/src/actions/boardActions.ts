import { action } from "typesafe-actions";
import { IErrorResponse } from "../dtos/error";
import { IDeleteBoardLocalRequest } from "../dtos/requests";
import { IDeleteBoardResponse } from "../dtos/responses";
import {
  IAddViewerLocalRequest,
  IAddViewerResponse,
  IDeleteViewerLocalRequest,
  IDeleteViewerResponse,
  IUnsubBoardLocalRequest,
  IUnsubBoardResponse,
} from "../dtos/local-requests";
import { IBoard } from "../entities/IBoard";
import { IBoardMiniature } from "../entities/IBoardMiniature";
import * as actionTypes from "./constants";

export const gotBoardMiniatures = (boards: IBoardMiniature[]) =>
  action(actionTypes.GOT_BOARD_MINIATURES, { boards });
export const gotBoardMiniaturesError = (message: string) =>
  action(actionTypes.GOT_BOARD_MINIATURES_ERROR, { message });

export const resetBoard = () => action(actionTypes.RESET_BOARD); // local action, doesn't need error handling

export const getBoard = (boardId: string) =>
  action(actionTypes.GET_BOARD, { boardId });
export const gotBoard = (board: IBoard) =>
  action(actionTypes.GOT_BOARD, { board });
export const gotBoardError = (boardId: string, message: string) =>
  action(actionTypes.GOT_BOARD_ERROR, { boardId, message });

export const renameBoard = (
  boardId: string,
  oldBoardName: string,
  newBoardName: string
) => action(actionTypes.RENAME_BOARD, { boardId, oldBoardName, newBoardName });
export const renamedBoard = (boardId: string, boardName: string) =>
  action(actionTypes.RENAMED_BOARD, { boardId, boardName });
export const renamedBoardError = (
  boardId: string,
  oldBoardName: string,
  message: string
) =>
  action(actionTypes.RENAMED_BOARD_ERROR, { boardId, oldBoardName, message });

export const createBoard = (boardName: string) =>
  action(actionTypes.CREATE_BOARD, { boardName });
export const createdBoard = (board: IBoard) =>
  action(actionTypes.CREATED_BOARD, { board });
export const createdBoardError = (boardName: string, message: string) =>
  action(actionTypes.CREATED_BOARD_ERROR, { boardName, message });

export const deleteBoard = (request: IDeleteBoardLocalRequest) =>
  action(actionTypes.DELETE_BOARD, request);
export const deletedBoard = (response: IDeleteBoardResponse) =>
  action(actionTypes.DELETED_BOARD, response);
export const deletedBoardError = (
  response: IDeleteBoardLocalRequest & IErrorResponse
) => action(actionTypes.DELETED_BOARD_ERROR, response);

export const addViewer = (request: IAddViewerLocalRequest) =>
  action(actionTypes.ADD_VIEWER, request);
export const addViewerSuccess = (response: IAddViewerResponse) =>
  action(actionTypes.ADD_VIEWER_SUCCESS, response);
export const addViewerError = (
  error: IAddViewerLocalRequest & IErrorResponse
) => action(actionTypes.ADD_VIEWER_ERROR, error);

export const removeViewer = (request: IDeleteViewerLocalRequest) =>
  action(actionTypes.REMOVE_VIEWER, request);
export const removeViewerSuccess = (response: IDeleteViewerResponse) =>
  action(actionTypes.REMOVE_VIEWER_SUCCESS, response);
export const removeViewerError = (
  error: IDeleteViewerLocalRequest & IErrorResponse
) => action(actionTypes.REMOVE_VIEWER_ERROR, error);

export const unsubBoard = (request: IUnsubBoardLocalRequest) =>
  action(actionTypes.UNSUB_BOARD, request);
export const unsubBoardSuccess = (response: IUnsubBoardResponse) =>
  action(actionTypes.UNSUB_BOARD_SUCCESS, response);
export const unsubBoardError = (
  error: IUnsubBoardLocalRequest & IErrorResponse
) => action(actionTypes.UNSUB_BOARD_ERROR, error);
