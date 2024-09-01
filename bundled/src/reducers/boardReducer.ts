import { ActionType } from "typesafe-actions";
import * as boardsActions from "../actions/boardActions";
import {
  ADD_ATTACHMENT,
  ADD_ATTACHMENT_ERROR,
  ADD_ATTACHMENT_SUCCESS,
  ADD_COMMENT_SUCCESS,
  ADD_VIEWER,
  ADD_VIEWER_ERROR,
  ADD_VIEWER_SUCCESS,
  CHANGE_TASK_DESCRIPTION,
  CHANGED_TASK_DESCRIPTION_ERROR,
  CREATED_LIST,
  CREATED_TASK,
  DELETE_COMMENT,
  DELETE_COMMENT_ERROR,
  DELETED_LIST,
  DELETED_TASK,
  EDIT_COMMENT,
  EDIT_COMMENT_ERROR,
  GOT_BOARD,
  MOVE_LIST,
  MOVE_LIST_ERROR,
  MOVE_LIST_SUCCESS,
  MOVE_TASK,
  MOVE_TASK_ERROR,
  MOVE_TASK_SUCCESS,
  REMOVE_ATTACHMENT,
  REMOVE_ATTACHMENT_ERROR,
  REMOVE_ATTACHMENT_SUCCESS,
  REMOVE_VIEWER,
  REMOVE_VIEWER_ERROR,
  REMOVE_VIEWER_SUCCESS,
  RENAME_BOARD,
  RENAME_LIST,
  RENAME_TASK,
  RENAMED_BOARD_ERROR,
  RENAMED_LIST_ERROR,
  RENAMED_TASK_ERROR,
  RESET_BOARD,
} from "../actions/constants";
import * as listActions from "../actions/listActions";
import * as taskActions from "../actions/taskActions";
import { IErrorResponse } from "../dtos/error";
import { IMoveListLocalRequest, IMoveTaskLocalRequest } from "../dtos/moveList";
import {
  IAddAttachmentLocalRequest,
  IAddViewerLocalRequest,
  IRemoveAttachmentLocalRequest,
  IDeleteCommentLocalRequest,
  IDeleteViewerLocalRequest,
  IEditCommentLocalRequest,
} from "../dtos/local-requests";
import {
  ICreateAttachmentResponse,
  IAddCommentResponse,
  IAddViewerResponse,
  IRemoveAttachmentResponse,
  IMoveListResponse,
  IMoveTaskResponse,
  IRemoveViewerResponse,
} from "../dtos/responses";
import { IAttachment } from "../entities/IAttachment";
import { IBoard } from "../entities/IBoard";
import { IComment } from "../entities/IComment";
import { IList } from "../entities/IList";
import { ITask } from "../entities/ITask";
import { IUser } from "../entities/IUser";
import { sortComments, sortLists } from "../services/sortService";
import { initialStoreState } from "../store/initialStoreState";

type actions =
  | ActionType<typeof boardsActions.gotBoard>
  | ActionType<typeof boardsActions.renameBoard>
  | ActionType<typeof boardsActions.renamedBoardError>
  | ActionType<typeof boardsActions.resetBoard>
  | ActionType<typeof listActions.createdList>
  | ActionType<typeof listActions.renameList>
  | ActionType<typeof listActions.renamedListError>
  | ActionType<typeof listActions.deletedList>
  | ActionType<typeof taskActions.createdTask>
  | ActionType<typeof taskActions.deletedTask>
  | ActionType<typeof taskActions.renameTask>
  | ActionType<typeof taskActions.renamedTaskError>
  | ActionType<typeof taskActions.changeTaskDescription>
  | ActionType<typeof taskActions.changedTaskDescriptionError>
  | ActionType<typeof listActions.moveList>
  | ActionType<typeof listActions.moveListSuccess>
  | ActionType<typeof listActions.moveListError>
  | ActionType<typeof taskActions.moveTask>
  | ActionType<typeof taskActions.moveTaskSuccess>
  | ActionType<typeof taskActions.moveTaskError>
  | ActionType<typeof boardsActions.addViewer>
  | ActionType<typeof boardsActions.addViewerSuccess>
  | ActionType<typeof boardsActions.addViewerError>
  | ActionType<typeof boardsActions.removeViewer>
  | ActionType<typeof boardsActions.removeViewerSuccess>
  | ActionType<typeof boardsActions.removeViewerError>
  | ActionType<typeof taskActions.addAttachment>
  | ActionType<typeof taskActions.addAttachmentSuccess>
  | ActionType<typeof taskActions.addAttachmentError>
  | ActionType<typeof taskActions.deleteAttachment>
  | ActionType<typeof taskActions.deleteAttachmentSuccess>
  | ActionType<typeof taskActions.deleteAttachmentError>
  | ActionType<typeof taskActions.addComment>
  | ActionType<typeof taskActions.addCommentSuccess>
  | ActionType<typeof taskActions.addCommentError>
  | ActionType<typeof taskActions.deleteComment>
  | ActionType<typeof taskActions.deleteCommentSuccess>
  | ActionType<typeof taskActions.deleteCommentError>
  | ActionType<typeof taskActions.editComment>
  | ActionType<typeof taskActions.editCommentSuccess>
  | ActionType<typeof taskActions.editCommentError>;

function handleCreatedList(
  state: IBoard | null,
  boardId: string,
  newList: IList
) {
  if (state === null || boardId !== state.id) {
    return state;
  }

  const newLists = state.lists;

  newLists[newLists.length - 1] = {
    ...newLists[newLists.length - 1],
    nextListId: newList.id,
  };
  newLists.push(newList);

  return { ...state, lists: newLists };
}

function handleDeletedList(
  state: IBoard | null,
  boardId: string,
  listId: string
) {
  if (state === null || boardId !== state.id) {
    return state;
  }

  const newLists = state.lists;

  const indexOfDeletedList = newLists.findIndex(
    (someList) => listId === someList.id
  );
  if (indexOfDeletedList === -1) {
    return state;
  }

  if (indexOfDeletedList === 0) {
    newLists.shift();
    if (newLists.length > 0) {
      newLists[0] = { ...newLists[0], prevListId: "" };
    }
  } else if (indexOfDeletedList === newLists.length - 1) {
    newLists.pop();
    if (newLists.length > 0) {
      newLists[newLists.length - 1] = {
        ...newLists[newLists.length - 1],
        nextListId: "",
      };
    }
  } else {
    const prevList = {
      ...newLists[indexOfDeletedList - 1],
      nextListId: newLists[indexOfDeletedList + 1].id,
    };
    const nextList = {
      ...newLists[indexOfDeletedList + 1],
      prevListId: newLists[indexOfDeletedList - 1].id,
    };

    newLists[indexOfDeletedList - 1] = prevList;
    newLists[indexOfDeletedList + 1] = nextList;
    newLists.splice(indexOfDeletedList, 1);
  }

  return { ...state, lists: newLists };
}

function handleCreatedTask(
  state: IBoard | null,
  boardId: string,
  listId: string,
  task: ITask
) {
  if (state === null || boardId !== state.id) {
    return state;
  }

  const list = state.lists.find((someList) => someList.id === listId);

  if (list === undefined) {
    return state;
  }

  const indexOfList = state.lists.indexOf(list);

  const newTasks = list.tasks;
  newTasks[newTasks.length - 1] = {
    ...newTasks[newTasks.length - 1],
    nextTaskId: task.id,
  };
  newTasks.push(task);

  const newList = { ...list, tasks: newTasks };

  const newLists = state.lists;
  newLists[indexOfList] = newList;

  return { ...state, lists: newLists };
}

function handleDeletedTask(
  state: IBoard | null,
  boardId: string,
  listId: string,
  taskId: string
) {
  if (state === null || boardId !== state.id) {
    return state;
  }

  const concernedList = state.lists.find((someList) => someList.id === listId);

  if (concernedList === undefined) {
    return state;
  }

  const indexOfConcernedList = state.lists.indexOf(concernedList);

  const deletedTask = concernedList.tasks.find((task) => task.id === taskId);

  if (deletedTask === undefined) {
    return state;
  }

  const newTasks = concernedList.tasks;
  const deletedTaskIndex = newTasks.indexOf(deletedTask);

  const prevTask = newTasks.find((task) => task.id === deletedTask.prevTaskId);
  const nextTask = newTasks.find((task) => task.id === deletedTask.nextTaskId);

  if (prevTask !== undefined && nextTask !== undefined) {
    // both exist
    const prevTaskIndex = newTasks.indexOf(prevTask);
    const nextTaskIndex = newTasks.indexOf(nextTask);

    newTasks[prevTaskIndex] = {
      ...newTasks[prevTaskIndex],
      nextTaskId: nextTask.id,
    };
    newTasks[nextTaskIndex] = {
      ...newTasks[nextTaskIndex],
      prevTaskId: prevTask.id,
    };
  } else if (prevTask !== undefined && nextTask === undefined) {
    // prev exists === deleted last initialTask
    const prevTaskIndex = newTasks.indexOf(prevTask);
    newTasks[prevTaskIndex] = { ...newTasks[prevTaskIndex], nextTaskId: "" };
  } else if (prevTask === undefined && nextTask !== undefined) {
    // next exists === deleted first initialTask
    const nextTaskIndex = newTasks.indexOf(nextTask);
    newTasks[nextTaskIndex] = { ...newTasks[nextTaskIndex], prevTaskId: "" };
  }

  newTasks.splice(deletedTaskIndex, 1);

  const newLists = state.lists;
  newLists[indexOfConcernedList] = { ...concernedList, tasks: newTasks };

  return { ...state, lists: newLists };
}

function handleMoveList(state: IBoard | null, request: IMoveListLocalRequest) {
  if (state === null || request.boardId !== state.id) {
    return state;
  }

  const movedList = state.lists.find(
    (someList) => someList.id === request.listId
  );
  if (movedList === undefined) {
    return { ...state };
  }

  const newLists = state.lists;

  const oldPrevList = state.lists.find(
    (someList) => someList.id === request.srcPrevListId
  );
  const oldPrevListId = oldPrevList !== undefined ? oldPrevList.id : "";

  const oldNextList = state.lists.find(
    (someList) => someList.id === request.srcNextListId
  );
  const oldNextListId = oldNextList !== undefined ? oldNextList.id : "";

  const newPrevList = state.lists.find(
    (someList) => someList.id === request.targetPrevListId
  );
  const newPrevListId = newPrevList !== undefined ? newPrevList.id : "";

  const newNextList = state.lists.find(
    (someList) => someList.id === request.targetNextListId
  );
  const newNextListId = newNextList !== undefined ? newNextList.id : "";

  if (oldPrevList !== undefined) {
    const oldPrevListIndex = state.lists.indexOf(oldPrevList);
    newLists[oldPrevListIndex] = { ...oldPrevList, nextListId: oldNextListId };
  }

  if (oldNextList !== undefined) {
    const oldNextListIndex = state.lists.indexOf(oldNextList);
    newLists[oldNextListIndex] = { ...oldNextList, prevListId: oldPrevListId };
  }

  if (newPrevList !== undefined) {
    const newPrevListIndex = state.lists.indexOf(newPrevList);
    newLists[newPrevListIndex] = { ...newPrevList, nextListId: request.listId };
  }

  if (newNextList !== undefined) {
    const newNextListIndex = state.lists.indexOf(newNextList);
    newLists[newNextListIndex] = { ...newNextList, prevListId: request.listId };
  }

  const newMovedList = {
    ...movedList,
    prevListId: newPrevListId,
    nextListId: newNextListId,
  };

  newLists.splice(request.oldPosition, 1);
  newLists.splice(request.newPosition, 0, newMovedList);

  return { ...state, lists: newLists };
}

function handleMoveListSuccess(
  state: IBoard | null,
  response: IMoveListResponse
) {
  if (state === null || response.boardId !== state.id) {
    return state;
  }
  return { ...state };
}

function handleMoveListError(
  state: IBoard | null,
  request: IMoveListLocalRequest
) {
  const revertMoveRequest = {
    ...request,
    newPosition: request.oldPosition,
    oldPosition: request.newPosition,
    srcNextListId: request.targetNextListId,
    srcPrevListId: request.targetPrevListId,
    targetNextTaskId: request.srcNextListId,
    targetPrevTaskId: request.srcPrevListId,
  };
  return handleMoveList(state, revertMoveRequest);
}

function handleMoveTask(state: IBoard | null, request: IMoveTaskLocalRequest) {
  if (state === null || request.boardId !== state.id) {
    return state;
  }

  const srcList = state.lists.find(
    (someList) => someList.id === request.listId
  );
  if (srcList === undefined) {
    return { ...state };
  }
  const srcListIndex = state.lists.indexOf(srcList);

  const movedTask = srcList.tasks.find(
    (someTask: ITask) => someTask.id === request.taskId
  );
  if (movedTask === undefined) {
    return { ...state };
  }

  if (request.listId === request.targetListId) {
    const newLists = state.lists;
    const newTasks = srcList.tasks;

    const oldPrevTask = srcList.tasks.find(
      (someList) => someList.id === request.srcPrevTaskId
    );
    const oldPrevTaskId = oldPrevTask !== undefined ? oldPrevTask.id : "";

    const oldNextTask = srcList.tasks.find(
      (someList) => someList.id === request.srcNextTaskId
    );
    const oldNextTaskId = oldNextTask !== undefined ? oldNextTask.id : "";

    const newPrevTask = srcList.tasks.find(
      (someList) => someList.id === request.targetPrevTaskId
    );
    const newPrevTaskId = newPrevTask !== undefined ? newPrevTask.id : "";

    const newNextTask = srcList.tasks.find(
      (someList) => someList.id === request.targetNextTaskId
    );
    const newNextTaskId = newNextTask !== undefined ? newNextTask.id : "";

    if (oldPrevTask !== undefined) {
      const oldPrevTaskIndex = srcList.tasks.indexOf(oldPrevTask);
      newTasks[oldPrevTaskIndex] = {
        ...oldPrevTask,
        nextTaskId: oldNextTaskId,
      };
    }

    if (oldNextTask !== undefined) {
      const oldNextTaskIndex = srcList.tasks.indexOf(oldNextTask);
      newTasks[oldNextTaskIndex] = {
        ...oldNextTask,
        prevTaskId: oldPrevTaskId,
      };
    }

    if (newPrevTask !== undefined) {
      const newPrevTaskIndex = srcList.tasks.indexOf(newPrevTask);
      newTasks[newPrevTaskIndex] = {
        ...newPrevTask,
        nextTaskId: request.taskId,
      };
    }

    if (newNextTask !== undefined) {
      const newNextTaskIndex = srcList.tasks.indexOf(newNextTask);
      newTasks[newNextTaskIndex] = {
        ...newNextTask,
        prevTaskId: request.taskId,
      };
    }

    const newMovedTask = {
      ...movedTask,
      prevTaskId: newPrevTaskId,
      nextTaskId: newNextTaskId,
    };

    newTasks.splice(request.oldPosition, 1);
    newTasks.splice(request.newPosition, 0, newMovedTask);

    newLists[srcListIndex] = { ...srcList, tasks: newTasks };
    return { ...state, lists: newLists };
  } else {
    const targetList = state.lists.find(
      (someList) => someList.id === request.targetListId
    );
    if (targetList === undefined) {
      return { ...state };
    }
    const targetListIndex = state.lists.indexOf(targetList);

    const newLists = state.lists;
    const newSrcTasks = srcList.tasks;
    const newTargetTasks = targetList.tasks;

    const srcPrevTask = srcList.tasks.find(
      (someList) => someList.id === request.srcPrevTaskId
    );
    const srcPrevTaskId = srcPrevTask !== undefined ? srcPrevTask.id : "";

    const srcNextTask = srcList.tasks.find(
      (someList) => someList.id === request.srcNextTaskId
    );
    const srcNextTaskId = srcNextTask !== undefined ? srcNextTask.id : "";

    const targetPrevTask = srcList.tasks.find(
      (someList) => someList.id === request.targetPrevTaskId
    );
    const targetPrevTaskId =
      targetPrevTask !== undefined ? targetPrevTask.id : "";

    const targetNextTask = srcList.tasks.find(
      (someList) => someList.id === request.targetNextTaskId
    );
    const targetNextTaskId =
      targetNextTask !== undefined ? targetNextTask.id : "";

    if (srcPrevTask !== undefined) {
      const srcPrevTaskIndex = srcList.tasks.indexOf(srcPrevTask);
      newSrcTasks[srcPrevTaskIndex] = {
        ...srcPrevTask,
        nextTaskId: srcNextTaskId,
      };
    }

    if (srcNextTask !== undefined) {
      const srcNextTaskIndex = srcList.tasks.indexOf(srcNextTask);
      newSrcTasks[srcNextTaskIndex] = {
        ...srcNextTask,
        prevTaskId: srcPrevTaskId,
      };
    }

    if (targetPrevTask !== undefined) {
      const targetPrevTaskIndex = targetList.tasks.indexOf(targetPrevTask);
      newTargetTasks[targetPrevTaskIndex] = {
        ...targetPrevTask,
        nextTaskId: request.taskId,
      };
    }

    if (targetNextTask !== undefined) {
      const targetNextTaskIndex = targetList.tasks.indexOf(targetNextTask);
      newTargetTasks[targetNextTaskIndex] = {
        ...targetNextTask,
        prevTaskId: request.taskId,
      };
    }

    const newMovedTask: ITask = {
      ...movedTask,
      prevTaskId: targetPrevTaskId,
      nextTaskId: targetNextTaskId,
    };

    newSrcTasks.splice(request.oldPosition, 1);
    if (request.newPosition < targetList.tasks.length) {
      newTargetTasks.splice(request.newPosition, 0, newMovedTask);
    } else {
      newTargetTasks.push(newMovedTask);
    }

    newLists[srcListIndex] = { ...srcList, tasks: newSrcTasks };
    newLists[targetListIndex] = { ...targetList, tasks: newTargetTasks };

    return { ...state, lists: newLists };
  }
}

function handleMoveTaskSuccess(
  state: IBoard | null,
  response: IMoveTaskResponse
) {
  if (state === null || response.boardId !== state.id) {
    return state;
  }
  return { ...state };
}

function handleMoveTaskError(
  state: IBoard | null,
  request: IMoveTaskLocalRequest
) {
  const revertMoveRequest: IMoveTaskLocalRequest = {
    ...request,
    newPosition: request.oldPosition,
    oldPosition: request.newPosition,
    srcNextTaskId: request.targetNextTaskId,
    srcPrevTaskId: request.targetPrevTaskId,
    targetNextTaskId: request.srcNextTaskId,
    targetPrevTaskId: request.srcPrevTaskId,
  };
  return handleMoveTask(state, revertMoveRequest);
}

function handleAddViewer(
  state: IBoard | null,
  request: IAddViewerLocalRequest
) {
  if (
    state === null ||
    request.boardId !== state.id ||
    state.viewers === null
  ) {
    return state;
  }

  if (state.viewers.indexOf(request.user) !== -1) {
    // already added
    return state;
  }

  const newViewers = state.viewers;
  newViewers.push(request.user);
  return { ...state, viewers: newViewers };
}

function handleAddViewerSuccess(
  state: IBoard | null,
  request: IAddViewerResponse
) {
  if (
    state === null ||
    request.boardId !== state.id ||
    state.viewers === null
  ) {
    return state;
  }
  return state;
}

function handleAddViewerError(
  state: IBoard | null,
  request: IAddViewerLocalRequest & IErrorResponse
) {
  if (
    state === null ||
    request.boardId !== state.id ||
    state.viewers === null
  ) {
    return state;
  }

  if (state.viewers.indexOf(request.user) === -1) {
    // already fixed addition error
    return state;
  }

  const addedViewerIndex = state.viewers!.findIndex(
    (viewer: IUser) => viewer.uid === request.user.uid
  );
  if (addedViewerIndex === -1) {
    return state;
  }
  const newViewers = state.viewers;
  newViewers.splice(addedViewerIndex, 1);
  return { ...state, viewers: newViewers };
}

function handleRemoveViewer(
  state: IBoard | null,
  request: IDeleteViewerLocalRequest
) {
  if (
    state === null ||
    request.boardId !== state.id ||
    state.viewers === null
  ) {
    return state;
  }

  if (state.viewers.indexOf(request.user) === -1) {
    // already deleted
    return state;
  }

  const removedViewerIndex = state.viewers!.findIndex(
    (viewer: IUser) => viewer.uid === request.user.uid
  );
  if (removedViewerIndex === -1) {
    return state;
  }
  const newViewers = state.viewers;
  newViewers.splice(removedViewerIndex, 1);
  return { ...state, viewers: newViewers };
}

function handleRemoveViewerSuccess(
  state: IBoard | null,
  request: IRemoveViewerResponse
) {
  if (
    state === null ||
    request.boardId !== state.id ||
    state.viewers === null
  ) {
    return state;
  }
  return state;
}

function handleRemoveViewerError(
  state: IBoard | null,
  request: IDeleteViewerLocalRequest & IErrorResponse
) {
  if (
    state === null ||
    request.boardId !== state.id ||
    state.viewers === null
  ) {
    return state;
  }

  if (state.viewers.indexOf(request.user) !== -1) {
    // already fixed deletion error
    return state;
  }

  const newViewers = state.viewers;
  newViewers.push(request.user);
  return { ...state, viewers: newViewers };
}

function handleAddAttachment(
  state: IBoard | null,
  request: IAddAttachmentLocalRequest
) {
  if (
    state === null ||
    request.boardId !== state.id ||
    state.viewers === null
  ) {
    return state;
  }

  return state;
}

function handleAddAttachmentSuccess(
  state: IBoard | null,
  request: ICreateAttachmentResponse
) {
  if (state === null || request.attachment.boardId !== state.id) {
    return state;
  }

  const list = state.lists.find(
    (someList) => someList.id === request.attachment.listId
  );
  if (list === undefined) {
    return state;
  }
  const listIndex = state.lists.indexOf(list);

  const task = list.tasks.find(
    (someTask) => someTask.id === request.attachment.taskId
  );
  if (task === undefined) {
    return state;
  }
  const newTaskIndex = list.tasks.indexOf(task);

  if (task.attachments.indexOf(request.attachment) !== -1) {
    // already added
    return state;
  }

  const newAttachments = task.attachments.slice(0, state.lists.length);
  newAttachments.push(request.attachment);

  const newTask = { ...task, attachments: newAttachments };
  const newTasks = list.tasks.slice(0, list.tasks.length);
  newTasks[newTaskIndex] = newTask;

  const newList = { ...list, tasks: newTasks };
  const newLists = state.lists.slice(0, state.lists.length);
  newLists[listIndex] = newList;

  return { ...state, lists: newLists };
}

function handleAddAttachmentError(
  state: IBoard | null,
  request: IAddAttachmentLocalRequest & IErrorResponse
) {
  if (state === null || request.boardId !== state.id) {
    return state;
  }

  return state;
}

function handleRemoveAttachment(
  state: IBoard | null,
  request: IRemoveAttachmentLocalRequest
) {
  if (state === null || request.attachment.boardId !== state.id) {
    return state;
  }

  const list = state.lists.find(
    (someList) => someList.id === request.attachment.listId
  );
  if (list === undefined) {
    return state;
  }
  const listIndex = state.lists.indexOf(list);

  const task = list.tasks.find(
    (someTask) => someTask.id === request.attachment.taskId
  );
  if (task === undefined) {
    return state;
  }
  const taskIndex = list.tasks.indexOf(task);

  const attachmentIndex = task.attachments.indexOf(request.attachment);
  if (attachmentIndex === -1) {
    // already removed
    return state;
  }

  const newAttachments: IAttachment[] = task.attachments.slice();
  newAttachments.splice(attachmentIndex, 1);

  const newTask: ITask = { ...task, attachments: newAttachments };
  const newTasks: ITask[] = list.tasks.slice();
  newTasks[taskIndex] = newTask;

  const newList: IList = { ...list, tasks: newTasks };
  const newLists: IList[] = state.lists.slice();
  newLists[listIndex] = newList;

  return { ...state, lists: newLists };
}

function handleRemoveAttachmentSuccess(
  state: IBoard | null,
  request: IRemoveAttachmentResponse
) {
  if (
    state === null ||
    request.boardId !== state.id ||
    state.viewers === null
  ) {
    return state;
  }
  return state;
}

function handleRemoveAttachmentError(
  state: IBoard | null,
  request: IRemoveAttachmentLocalRequest & IErrorResponse
) {
  if (state === null || request.attachment.boardId !== state.id) {
    return state;
  }

  const list = state.lists.find(
    (someList) => someList.id === request.attachment.listId
  );
  if (list === undefined) {
    return state;
  }
  const listIndex = state.lists.indexOf(list);

  const task = list.tasks.find(
    (someTask) => someTask.id === request.attachment.taskId
  );
  if (task === undefined) {
    return state;
  }
  const newTaskIndex = list.tasks.indexOf(task);

  if (task.attachments.indexOf(request.attachment) !== -1) {
    // already added
    return state;
  }

  const newAttachments = task.attachments.slice(0, state.lists.length);
  newAttachments.push(request.attachment);

  const newTask = { ...task, attachments: newAttachments };
  const newTasks = list.tasks.slice(0, list.tasks.length);
  newTasks[newTaskIndex] = newTask;

  const newList = { ...list, tasks: newTasks };
  const newLists = state.lists.slice(0, state.lists.length);
  newLists[listIndex] = newList;

  return { ...state, lists: newLists };
}

function handleRenameBoard(
  state: IBoard | null,
  boardId: string,
  newName: string
) {
  if (state === null || boardId !== state.id) {
    return state;
  }
  return { ...state, name: newName };
}

function handleRenameBoardError(
  state: IBoard | null,
  boardId: string,
  oldName: string
) {
  if (state === null || boardId !== state.id) {
    return state;
  }
  return { ...state, name: oldName };
}

function handleRenameList(
  state: IBoard | null,
  boardId: string,
  listId: string,
  newName: string
) {
  if (state === null || boardId !== state.id) {
    return state;
  }

  const list = state.lists.find((someList) => someList.id === listId);
  if (list === undefined) {
    return state;
  }
  const listIndex = state.lists.indexOf(list);
  const newList = { ...list, name: newName };
  const newLists = state.lists.slice();
  newLists[listIndex] = newList;

  return { ...state, lists: newLists };
}

function handleRenameListError(
  state: IBoard | null,
  boardId: string,
  listId: string,
  oldName: string
) {
  if (state === null || boardId !== state.id) {
    return state;
  }
  if (state === null || boardId !== state.id) {
    return state;
  }

  const list = state.lists.find((someList) => someList.id === listId);
  if (list === undefined) {
    return state;
  }
  const listIndex = state.lists.indexOf(list);
  const newList = { ...list, name: oldName };
  const newLists = state.lists.slice();
  newLists[listIndex] = newList;

  return { ...state, lists: newLists };
}

function handleRenameTask(
  state: IBoard | null,
  boardId: string,
  listId: string,
  taskId: string,
  newName: string
) {
  if (state === null || boardId !== state.id) {
    return state;
  }
  if (state === null || boardId !== state.id) {
    return state;
  }

  const list = state.lists.find((someList) => someList.id === listId);
  if (list === undefined) {
    return state;
  }
  const listIndex = state.lists.indexOf(list);

  const task = list.tasks.find((someTask) => someTask.id === taskId);
  if (task === undefined) {
    return state;
  }
  const taskIndex = list.tasks.indexOf(task);

  const newTask = { ...task, name: newName };
  const newTasks = list.tasks.slice();
  newTasks[taskIndex] = newTask;

  const newList = { ...list, tasks: newTasks };
  const newLists = state.lists.slice();
  newLists[listIndex] = newList;

  return { ...state, lists: newLists };
}

function handleRenameTaskError(
  state: IBoard | null,
  boardId: string,
  listId: string,
  taskId: string,
  oldName: string
) {
  if (state === null || boardId !== state.id) {
    return state;
  }
  if (state === null || boardId !== state.id) {
    return state;
  }

  const list = state.lists.find((someList) => someList.id === listId);
  if (list === undefined) {
    return state;
  }
  const listIndex = state.lists.indexOf(list);

  const task = list.tasks.find((someTask) => someTask.id === taskId);
  if (task === undefined) {
    return state;
  }
  const taskIndex = list.tasks.indexOf(task);

  const newTask = { ...task, name: oldName };
  const newTasks = list.tasks.slice();
  newTasks[taskIndex] = newTask;

  const newList = { ...list, tasks: newTasks };
  const newLists = state.lists.slice();
  newLists[listIndex] = newList;

  return { ...state, lists: newLists };
}

function handleChangeTaskDescription(
  state: IBoard | null,
  boardId: string,
  listId: string,
  taskId: string,
  newDescription: string
) {
  if (state === null || boardId !== state.id) {
    return state;
  }
  if (state === null || boardId !== state.id) {
    return state;
  }

  const list = state.lists.find((someList) => someList.id === listId);
  if (list === undefined) {
    return state;
  }
  const listIndex = state.lists.indexOf(list);

  const task = list.tasks.find((someTask) => someTask.id === taskId);
  if (task === undefined) {
    return state;
  }
  const taskIndex = list.tasks.indexOf(task);

  const newTask = { ...task, description: newDescription };
  const newTasks = list.tasks.slice();
  newTasks[taskIndex] = newTask;

  const newList = { ...list, tasks: newTasks };
  const newLists = state.lists.slice();
  newLists[listIndex] = newList;

  return { ...state, lists: newLists };
}

function handleChangeTaskDescriptionError(
  state: IBoard | null,
  boardId: string,
  listId: string,
  taskId: string,
  oldDescription: string
) {
  if (state === null || boardId !== state.id) {
    return state;
  }
  if (state === null || boardId !== state.id) {
    return state;
  }

  const list = state.lists.find((someList) => someList.id === listId);
  if (list === undefined) {
    return state;
  }
  const listIndex = state.lists.indexOf(list);

  const task = list.tasks.find((someTask) => someTask.id === taskId);
  if (task === undefined) {
    return state;
  }
  const taskIndex = list.tasks.indexOf(task);

  const newTask = { ...task, description: oldDescription };
  const newTasks = list.tasks.slice();
  newTasks[taskIndex] = newTask;

  const newList = { ...list, tasks: newTasks };
  const newLists = state.lists.slice();
  newLists[listIndex] = newList;

  return { ...state, lists: newLists };
}

function handleAddCommentSuccess(
  state: IBoard | null,
  response: IAddCommentResponse
) {
  if (state === null || response.comment.boardId !== state.id) {
    return state;
  }
  const list = state.lists.find(
    (someList) => someList.id === response.comment.listId
  );
  if (list === undefined) {
    return state;
  }
  const listIndex = state.lists.indexOf(list);

  const task = list.tasks.find(
    (someTask) => someTask.id === response.comment.taskId
  );
  if (task === undefined) {
    return state;
  }
  const taskIndex = list.tasks.indexOf(task);

  let newComments = task.comments.slice();
  newComments.push(response.comment);
  newComments = sortComments(newComments);

  const newTask = { ...task, comments: newComments };
  const newTasks = list.tasks.slice();
  newTasks[taskIndex] = newTask;

  const newList = { ...list, tasks: newTasks };
  const newLists = state.lists.slice();
  newLists[listIndex] = newList;

  return { ...state, lists: newLists };
}

function handleEditComment(
  state: IBoard | null,
  request: IEditCommentLocalRequest
) {
  if (state === null || request.comment.boardId !== state.id) {
    return state;
  }
  const list = state.lists.find(
    (someList) => someList.id === request.comment.listId
  );
  if (list === undefined) {
    return state;
  }
  const listIndex = state.lists.indexOf(list);

  const task = list.tasks.find(
    (someTask) => someTask.id === request.comment.taskId
  );
  if (task === undefined) {
    return state;
  }
  const taskIndex = list.tasks.indexOf(task);

  const comment = task.comments.find(
    (someComment) => someComment.id === request.comment.id
  );
  if (comment === undefined) {
    return state;
  }
  const commentIndex = task.comments.indexOf(comment);
  const newComment: IComment = { ...comment, content: request.newContent };
  const newComments = task.comments.slice();
  newComments[commentIndex] = newComment;

  const newTask = { ...task, comments: newComments };
  const newTasks = list.tasks.slice();
  newTasks[taskIndex] = newTask;

  const newList = { ...list, tasks: newTasks };
  const newLists = state.lists.slice();
  newLists[listIndex] = newList;

  return { ...state, lists: newLists };
}

function handleEditCommentError(
  state: IBoard | null,
  request: IEditCommentLocalRequest
) {
  if (state === null || request.comment.boardId !== state.id) {
    return state;
  }
  const list = state.lists.find(
    (someList) => someList.id === request.comment.listId
  );
  if (list === undefined) {
    return state;
  }
  const listIndex = state.lists.indexOf(list);

  const task = list.tasks.find(
    (someTask) => someTask.id === request.comment.taskId
  );
  if (task === undefined) {
    return state;
  }
  const taskIndex = list.tasks.indexOf(task);

  const comment = task.comments.find(
    (someComment) => someComment.id === request.comment.id
  );
  if (comment === undefined) {
    return state;
  }
  const commentIndex = task.comments.indexOf(comment);

  const newComment: IComment = { ...comment, content: request.comment.content };
  const newComments = task.comments.slice();
  newComments[commentIndex] = newComment;

  const newTask = { ...task, comments: newComments };
  const newTasks = list.tasks.slice();
  newTasks[taskIndex] = newTask;

  const newList = { ...list, tasks: newTasks };
  const newLists = state.lists.slice();
  newLists[listIndex] = newList;

  return { ...state, lists: newLists };
}

function handleDeleteComment(
  state: IBoard | null,
  request: IDeleteCommentLocalRequest
) {
  if (state === null || request.comment.boardId !== state.id) {
    return state;
  }
  const list = state.lists.find(
    (someList) => someList.id === request.comment.listId
  );
  if (list === undefined) {
    return state;
  }
  const listIndex = state.lists.indexOf(list);

  const task = list.tasks.find(
    (someTask) => someTask.id === request.comment.taskId
  );
  if (task === undefined) {
    return state;
  }
  const taskIndex = list.tasks.indexOf(task);

  const comment = task.comments.find(
    (someComment) => someComment.id === request.comment.id
  );
  if (comment === undefined) {
    return state;
  }

  const commentIndex = task.comments.indexOf(comment);
  const newComments = task.comments.slice();
  newComments.splice(commentIndex, 1);

  const newTask = { ...task, comments: newComments };
  const newTasks = list.tasks.slice();
  newTasks[taskIndex] = newTask;

  const newList = { ...list, tasks: newTasks };
  const newLists = state.lists.slice();
  newLists[listIndex] = newList;

  return { ...state, lists: newLists };
}

function handleDeleteCommentError(
  state: IBoard | null,
  request: IDeleteCommentLocalRequest
) {
  if (state === null || request.comment.boardId !== state.id) {
    return state;
  }
  const list = state.lists.find(
    (someList) => someList.id === request.comment.listId
  );
  if (list === undefined) {
    return state;
  }
  const listIndex = state.lists.indexOf(list);

  const task = list.tasks.find(
    (someTask) => someTask.id === request.comment.taskId
  );
  if (task === undefined) {
    return state;
  }
  const taskIndex = list.tasks.indexOf(task);

  let newComments = task.comments.slice();
  newComments.push(request.comment);
  newComments = sortComments(newComments);

  const newTask = { ...task, comments: newComments };
  const newTasks = list.tasks.slice();
  newTasks[taskIndex] = newTask;

  const newList = { ...list, tasks: newTasks };
  const newLists = state.lists.slice();
  newLists[listIndex] = newList;

  return { ...state, lists: newLists };
}

export const boardReducer = (
  state: IBoard | null = initialStoreState.board,
  action: actions
) => {
  switch (action.type) {
    case GOT_BOARD:
      return {
        id: action.payload.board.id,
        lists: sortLists(action.payload.board.lists),
        name: action.payload.board.name,
        owner: action.payload.board.owner,
        viewers: action.payload.board.viewers,
      };

    case RENAME_BOARD:
      return handleRenameBoard(
        state,
        action.payload.boardId,
        action.payload.newBoardName
      );

    case RENAMED_BOARD_ERROR:
      return handleRenameBoardError(
        state,
        action.payload.boardId,
        action.payload.oldBoardName
      );

    case CREATED_LIST:
      return handleCreatedList(
        state,
        action.payload.boardId,
        action.payload.list
      );

    case RENAME_LIST:
      return handleRenameList(
        state,
        action.payload.boardId,
        action.payload.listId,
        action.payload.newListName
      );

    case RENAMED_LIST_ERROR:
      return handleRenameListError(
        state,
        action.payload.boardId,
        action.payload.listId,
        action.payload.oldListName
      );

    case DELETED_LIST:
      return handleDeletedList(
        state,
        action.payload.boardId,
        action.payload.listId
      );

    case CREATED_TASK:
      return handleCreatedTask(
        state,
        action.payload.boardId,
        action.payload.listId,
        action.payload.task
      );

    case RENAME_TASK:
      return handleRenameTask(
        state,
        action.payload.boardId,
        action.payload.listId,
        action.payload.taskId,
        action.payload.newTaskName
      );

    case RENAMED_TASK_ERROR:
      return handleRenameTaskError(
        state,
        action.payload.boardId,
        action.payload.listId,
        action.payload.taskId,
        action.payload.oldTaskName
      );

    case CHANGE_TASK_DESCRIPTION:
      return handleChangeTaskDescription(
        state,
        action.payload.boardId,
        action.payload.listId,
        action.payload.taskId,
        action.payload.newTaskDescription
      );

    case CHANGED_TASK_DESCRIPTION_ERROR:
      return handleChangeTaskDescriptionError(
        state,
        action.payload.boardId,
        action.payload.listId,
        action.payload.taskId,
        action.payload.oldTaskDescription
      );

    case DELETED_TASK:
      return handleDeletedTask(
        state,
        action.payload.boardId,
        action.payload.listId,
        action.payload.taskId
      );

    case MOVE_LIST:
      return handleMoveList(state, action.payload);

    case MOVE_LIST_SUCCESS:
      return handleMoveListSuccess(state, action.payload);

    case MOVE_LIST_ERROR:
      return handleMoveListError(state, action.payload);

    case MOVE_TASK:
      return handleMoveTask(state, action.payload);

    case MOVE_TASK_SUCCESS:
      return handleMoveTaskSuccess(state, action.payload);

    case MOVE_TASK_ERROR:
      return handleMoveTaskError(state, action.payload);

    case ADD_VIEWER:
      return handleAddViewer(state, action.payload);

    case ADD_VIEWER_SUCCESS:
      return handleAddViewerSuccess(state, action.payload);

    case ADD_VIEWER_ERROR:
      return handleAddViewerError(state, action.payload);

    case REMOVE_VIEWER:
      return handleRemoveViewer(state, action.payload);

    case REMOVE_VIEWER_SUCCESS:
      return handleRemoveViewerSuccess(state, action.payload);

    case REMOVE_VIEWER_ERROR:
      return handleRemoveViewerError(state, action.payload);

    case ADD_ATTACHMENT:
      return handleAddAttachment(state, action.payload);

    case ADD_ATTACHMENT_SUCCESS:
      return handleAddAttachmentSuccess(state, action.payload);

    case ADD_ATTACHMENT_ERROR:
      return handleAddAttachmentError(state, action.payload);

    case REMOVE_ATTACHMENT:
      return handleRemoveAttachment(state, action.payload);

    case REMOVE_ATTACHMENT_SUCCESS:
      return handleRemoveAttachmentSuccess(state, action.payload);

    case REMOVE_ATTACHMENT_ERROR:
      return handleRemoveAttachmentError(state, action.payload);

    case ADD_COMMENT_SUCCESS:
      return handleAddCommentSuccess(state, action.payload);

    case EDIT_COMMENT:
      return handleEditComment(state, action.payload);

    case EDIT_COMMENT_ERROR:
      return handleEditCommentError(state, action.payload);

    case DELETE_COMMENT:
      return handleDeleteComment(state, action.payload);

    case DELETE_COMMENT_ERROR:
      return handleDeleteCommentError(state, action.payload);

    case RESET_BOARD:
      return null;

    default:
      return state;
  }
};
