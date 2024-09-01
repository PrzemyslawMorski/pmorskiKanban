import { IState } from "./storeStateInterface";

export const initialStoreState: IState = {
  alert: null,
  board: null,
  boards: null,
  createTaskListId: "",
  isListBeingAdded: false,
  listsWaitingForTasksToBeAdded: [],
  listsWaitingToBeDeleted: [],
  modal: null,
  tasksWaitingForAttachmentToBeAdded: [],
  tasksWaitingForCommentToBeAdded: [],
  tasksWaitingToBeDeleted: [],
  user: null,
};
