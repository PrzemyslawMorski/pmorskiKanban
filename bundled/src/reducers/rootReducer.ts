import { combineReducers } from "redux";
import { tasksWaitingForAttachmentToBeAddedReducer } from "./addingAttachmentReducer";
import { tasksWaitingForCommentToBeAddedReducer } from "./addingCommentReducer";
import { alertReducer } from "./alertReducer";
import { boardMiniaturesReducer } from "./boardMiniaturesReducer";
import { boardReducer } from "./boardReducer";
import { createTaskListIdReducer } from "./createTaskListId";
import { isListBeingAddedReducer } from "./isListBeingAdded";
import { listsWaitingForTasksToBeAddedReducer } from "./listsWaitingForTasksToBeAddedReducer";
import { listsWaitingToBeDeletedReducer } from "./listsWaitingToBeDeletedReducer";
import { modalReducer } from "./modalReducer";
import { tasksWaitingToBeDeletedReducer } from "./tasksWaitingToBeDeletedReducer";
import { userReducer } from "./userReducer";

export const rootReducer = combineReducers({
  alert: alertReducer,
  board: boardReducer,
  boards: boardMiniaturesReducer,
  createTaskListId: createTaskListIdReducer,
  isListBeingAdded: isListBeingAddedReducer,
  listsWaitingForTasksToBeAdded: listsWaitingForTasksToBeAddedReducer,
  listsWaitingToBeDeleted: listsWaitingToBeDeletedReducer,
  modal: modalReducer,
  tasksWaitingForAttachmentToBeAdded: tasksWaitingForAttachmentToBeAddedReducer,
  tasksWaitingForCommentToBeAdded: tasksWaitingForCommentToBeAddedReducer,
  tasksWaitingToBeDeleted: tasksWaitingToBeDeletedReducer,
  user: userReducer,
});
