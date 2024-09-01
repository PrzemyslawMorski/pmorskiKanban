import { IAttachment } from "../entities/IAttachment";
import { IBoardMiniature } from "../entities/IBoardMiniature";
import { IComment } from "../entities/IComment";
import { IUser } from "../entities/IUser";

export class IAddViewerLocalRequest {
  boardId: string;
  user: IUser;
}
export class IDeleteViewerLocalRequest {
  boardId: any;
  user: IUser;
}
export class IUnsubBoardLocalRequest {
  board: IBoardMiniature;
}
export class IDeleteBoardLocalRequest {
  board: IBoardMiniature;
}

export class IAddAttachmentLocalRequest {
  attachment: IAttachment;
  boardId: string;
  listId: string;
  taskId: string;
}

export class IRemoveAttachmentLocalRequest {
  attachment: IAttachment;
  boardId: string;
  listId: string;
  taskId: string;
}

export class IDeleteCommentLocalRequest {
  comment: IComment;
  boardId: string;
  listId: string;
  taskId: string;
}

export class IEditCommentLocalRequest {
  comment: IComment;
  newContent: string;
  boardId: string;
  listId: string;
  taskId: string;
}
