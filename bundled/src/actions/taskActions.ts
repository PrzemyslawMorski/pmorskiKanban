import { action } from "typesafe-actions";
import { IErrorResponse } from "../dtos/error";
import { IMoveTaskLocalRequest } from "../dtos/moveList";
import {
  IAddAttachmentLocalRequest,
  IRemoveAttachmentLocalRequest,
  IDeleteCommentLocalRequest,
  IEditCommentLocalRequest,
} from "../dtos/local-requests";
import {
  IAddCommentResponse,
  IRemoveAttachmentResponse,
  IDeleteCommentResponse,
  IEditCommentResponse,
  IMoveTaskResponse,
  ICreateAttachmentResponse,
} from "../dtos/responses";
import { ITask } from "../entities/ITask";
import * as actionTypes from "./constants";
import { IAddCommentRequest } from "../dtos/requests";

export const createTask = (boardId: string, listId: string, taskName: string) =>
  action(actionTypes.CREATE_TASK, { boardId, listId, taskName });
export const createdTask = (boardId: string, listId: string, task: ITask) =>
  action(actionTypes.CREATED_TASK, { boardId, listId, task });
export const createdTaskError = (
  boardId: string,
  listId: string,
  message: string
) => action(actionTypes.CREATED_TASK_ERROR, { boardId, listId, message });

export const deleteTask = (boardId: string, listId: string, taskId: string) =>
  action(actionTypes.DELETE_TASK, { boardId, listId, taskId });
export const deletedTask = (boardId: string, listId: string, taskId: string) =>
  action(actionTypes.DELETED_TASK, { boardId, listId, taskId });
export const deletedTaskError = (
  boardId: string,
  listId: string,
  taskId: string,
  message: string
) =>
  action(actionTypes.DELETED_TASK_ERROR, { boardId, listId, taskId, message });

export const renameTask = (
  boardId: string,
  listId: string,
  taskId: string,
  oldTaskName: string,
  newTaskName: string
) =>
  action(actionTypes.RENAME_TASK, {
    boardId,
    listId,
    taskId,
    oldTaskName,
    newTaskName,
  });
export const renamedTask = (
  boardId: string,
  listId: string,
  taskId: string,
  newTaskName: string
) => action(actionTypes.RENAMED_TASK, { boardId, listId, taskId, newTaskName });
export const renamedTaskError = (
  boardId: string,
  listId: string,
  taskId: string,
  oldTaskName: string,
  message: string
) =>
  action(actionTypes.RENAMED_TASK_ERROR, {
    boardId,
    listId,
    taskId,
    oldTaskName,
    message,
  });

export const changeTaskDescription = (
  boardId: string,
  listId: string,
  taskId: string,
  oldTaskDescription: string,
  newTaskDescription: string
) =>
  action(actionTypes.CHANGE_TASK_DESCRIPTION, {
    boardId,
    listId,
    taskId,
    oldTaskDescription,
    newTaskDescription,
  });
export const changedTaskDescription = (
  boardId: string,
  listId: string,
  taskId: string,
  newTaskDescription: string
) =>
  action(actionTypes.CHANGED_TASK_DESCRIPTION, {
    boardId,
    listId,
    taskId,
    newTaskDescription,
  });
export const changedTaskDescriptionError = (
  boardId: string,
  listId: string,
  taskId: string,
  oldTaskDescription: string,
  message: string
) =>
  action(actionTypes.CHANGED_TASK_DESCRIPTION_ERROR, {
    boardId,
    listId,
    taskId,
    oldTaskDescription,
    message,
  });

export const moveTask = (request: IMoveTaskLocalRequest) =>
  action(actionTypes.MOVE_TASK, request);
export const moveTaskSuccess = (response: IMoveTaskResponse) =>
  action(actionTypes.MOVE_TASK_SUCCESS, response);
export const moveTaskError = (
  request: IMoveTaskLocalRequest & IErrorResponse
) => action(actionTypes.MOVE_TASK_ERROR, request);

export const addAttachment = (request: IAddAttachmentLocalRequest) =>
  action(actionTypes.ADD_ATTACHMENT, request);
export const addAttachmentSuccess = (response: ICreateAttachmentResponse) =>
  action(actionTypes.ADD_ATTACHMENT_SUCCESS, response);
export const addAttachmentError = (
  request: IAddAttachmentLocalRequest & IErrorResponse
) => action(actionTypes.ADD_ATTACHMENT_ERROR, request);

export const deleteAttachment = (request: IRemoveAttachmentLocalRequest) =>
  action(actionTypes.REMOVE_ATTACHMENT, request);
export const deleteAttachmentSuccess = (response: IRemoveAttachmentResponse) =>
  action(actionTypes.REMOVE_ATTACHMENT_SUCCESS, response);
export const deleteAttachmentError = (
  request: IRemoveAttachmentLocalRequest & IErrorResponse
) => action(actionTypes.REMOVE_ATTACHMENT_ERROR, request);

export const addComment = (request: IAddCommentRequest) =>
  action(actionTypes.ADD_COMMENT, request);
export const addCommentSuccess = (response: IAddCommentResponse) =>
  action(actionTypes.ADD_COMMENT_SUCCESS, response);
export const addCommentError = (request: IAddCommentRequest & IErrorResponse) =>
  action(actionTypes.ADD_COMMENT_ERROR, request);

export const editComment = (request: IEditCommentLocalRequest) =>
  action(actionTypes.EDIT_COMMENT, request);
export const editCommentSuccess = (response: IEditCommentResponse) =>
  action(actionTypes.EDIT_COMMENT_SUCCESS, response);
export const editCommentError = (
  request: IEditCommentLocalRequest & IErrorResponse
) => action(actionTypes.EDIT_COMMENT_ERROR, request);

export const deleteComment = (request: IDeleteCommentLocalRequest) =>
  action(actionTypes.DELETE_COMMENT, request);
export const deleteCommentSuccess = (response: IDeleteCommentResponse) =>
  action(actionTypes.DELETE_COMMENT_SUCCESS, response);
export const deleteCommentError = (
  request: IDeleteCommentLocalRequest & IErrorResponse
) => action(actionTypes.DELETE_COMMENT_ERROR, request);
