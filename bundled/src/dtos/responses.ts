import { IAttachment } from "../entities/IAttachment";
import { IBoard } from "../entities/IBoard";
import { IBoardMiniature } from "../entities/IBoardMiniature";
import { IComment } from "../entities/IComment";
import { IList } from "../entities/IList";
import { ITask } from "../entities/ITask";
import { IUser } from "../entities/IUser";

export interface IGetBoardMiniaturesResponse {
  boardMiniatures: IBoardMiniature[];
}

export interface IGetBoardResponse {
  board: IBoard;
}

export interface IGetGravatarUrlResponse {
  gravatarUrl: string;
}

export interface IRenameBoardResponse {
  boardId: string;
  newBoardName: string;
}

export interface ICreateBoardResponse {
  newBoard: IBoard;
}

export interface IDeleteBoardResponse {
  boardId: string;
}

export interface ICreateListResponse {
  boardId: string;
  newList: IList;
}

export interface IDeleteListResponse {
  boardId: string;
  listId: string;
}

export interface IRenameListResponse {
  boardId: string;
  listId: string;
  newListName: string;
}

export interface ICreateTaskResponse {
  boardId: string;
  listId: string;
  task: ITask;
}

export interface IDeleteTaskResponse {
  boardId: string;
  listId: string;
  taskId: string;
}

export interface IRenameTaskResponse {
  boardId: string;
  listId: string;
  newTaskName: string;
  taskId: string;
}

export interface IChangeTaskDescriptionResponse {
  boardId: string;
  listId: string;
  newTaskDescription: string;
  taskId: string;
}

export interface IMoveListResponse {
  boardId: string;
  listId: string;
}

export interface IMoveTaskResponse {
  boardId: string;
  listId: string;
  targetListId: string;
  taskId: string;
}

export interface ISearchUsersResponse {
  boardId: string;
  users: IUser[];
}

export interface IAddViewerResponse {
  boardId: string;
  userId: string;
}

export interface IRemoveViewerResponse {
  boardId: string;
  userId: string;
}

export interface IUnsubBoardResponse {
  boardId: string;
  userId: string;
}

export interface ISetAttachmentUrlResponse {
  attachment: IAttachment;
}

export interface IRemoveAttachmentResponse {
  boardId: string;
  listId: string;
  taskId: string;
  attachmentId: string;
}

export interface ICreateAttachmentResponse {
  attachment: IAttachment;
  boardId: string;
  listId: string;
  taskId: string;
  attachmentId: string;
}

export interface IAddCommentResponse {
  comment: IComment;
}

export interface IDeleteCommentResponse {
  boardId: string;
  listId: string;
  taskId: string;
  commentId: string;
}

export interface IEditCommentResponse {
  comment: IComment;
}
