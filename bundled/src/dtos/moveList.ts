export class IMoveListLocalRequest {
  boardId: string;
  listId: string;
  srcNextListId: string;
  srcPrevListId: string;
  targetNextListId: string;
  targetPrevListId: string;
  oldPosition: number;
  newPosition: number;
}
export class IMoveTaskLocalRequest {
  boardId: string;
  listId: string;
  srcNextTaskId: string;
  srcPrevTaskId: string;
  targetListId: string;
  targetNextTaskId: string;
  targetPrevTaskId: string;
  taskId: string;
  oldPosition: number;
  newPosition: number;
}
