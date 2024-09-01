import { action } from "typesafe-actions";
import { IErrorResponse } from "../dtos/error";
import { IMoveListLocalRequest } from "../dtos/moveList";
import { IMoveListResponse } from "../dtos/responses";
import { IList } from "../entities/IList";
import * as actionTypes from "./constants";

export const createList = (boardId: string, listName: string) =>
  action(actionTypes.CREATE_LIST, { boardId, listName });
export const createdList = (boardId: string, list: IList) =>
  action(actionTypes.CREATED_LIST, { boardId, list });
export const createdListError = (boardId: string, message: string) =>
  action(actionTypes.CREATED_LIST_ERROR, { boardId, message });

export const renameList = (
  boardId: string,
  listId: string,
  oldListName: string,
  newListName: string
) =>
  action(actionTypes.RENAME_LIST, {
    boardId,
    listId,
    oldListName,
    newListName,
  });
export const renamedList = (
  boardId: string,
  listId: string,
  newListName: string
) => action(actionTypes.RENAMED_LIST, { boardId, listId, newListName });
export const renamedListError = (
  boardId: string,
  listId: string,
  oldListName: string,
  message: string
) =>
  action(actionTypes.RENAMED_LIST_ERROR, {
    boardId,
    listId,
    oldListName,
    message,
  });

export const deleteList = (boardId: string, listId: string) =>
  action(actionTypes.DELETE_LIST, { boardId, listId });
export const deletedList = (boardId: string, listId: string) =>
  action(actionTypes.DELETED_LIST, { boardId, listId });
export const deletedListError = (
  boardId: string,
  listId: string,
  message: string
) => action(actionTypes.DELETED_LIST_ERROR, { boardId, listId, message });

export const startCreatingTask = (listId: string) =>
  action(actionTypes.START_CREATING_TASK, { listId });
export const stopCreatingTask = () => action(actionTypes.STOP_CREATING_TASK);

export const moveList = (request: IMoveListLocalRequest) =>
  action(actionTypes.MOVE_LIST, request);
export const moveListSuccess = (response: IMoveListResponse) =>
  action(actionTypes.MOVE_LIST_SUCCESS, response);
export const moveListError = (
  response: IMoveListLocalRequest & IErrorResponse
) => action(actionTypes.MOVE_LIST_ERROR, response);
