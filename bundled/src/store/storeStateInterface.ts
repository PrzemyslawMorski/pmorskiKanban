import { IAlert } from "../entities/IAlert";
import { IBoard } from "../entities/IBoard";
import { IBoardMiniature } from "../entities/IBoardMiniature";
import { IComment } from "../entities/IComment";
import { IModal } from "../entities/IModal";
import { IUser } from "../entities/IUser";

export interface IState {
  readonly alert: IAlert;
  readonly appName: string;
  readonly user: IUser | null;
  readonly boards: IBoardMiniature[] | null;
  readonly board: IBoard | null;
  readonly listsWaitingForTasksToBeAdded: Array<{
    boardId: string;
    listId: string;
  }>;
  readonly listsWaitingToBeDeleted: Array<{
    boardId: string;
    listId: string;
  }>;
  readonly modal: IModal | null;
  readonly tasksWaitingForAttachmentToBeAdded: Array<{
    boardId: string;
    listId: string;
    taskId: string;
  }>;
  readonly tasksWaitingForCommentToBeAdded: Array<{
    boardId: string;
    listId: string;
    taskId: string;
    commentId: string;
    comment: IComment;
    author: IUser;
    editingAllowed: boolean;
  }>;
  readonly tasksWaitingToBeDeleted: Array<{
    boardId: string;
    listId: string;
    taskId: string;
  }>;
  readonly userLoggedIn: boolean;
  readonly isListBeingAdded: boolean;
  readonly listsWaitingForCommentsToBeAdded: Array<{
    boardId: string;
    listId: string;
  }>;
  readonly createTaskListId: string;
}
