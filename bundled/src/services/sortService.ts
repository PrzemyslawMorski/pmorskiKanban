import { IComment } from "../entities/IComment";
import { IList } from "../entities/IList";
import { ITask } from "../entities/ITask";

export const sortLists = (lists: IList[]): IList[] => {
  const sortedLists: IList[] = [];
  let currentList = lists.find((list) => list.prevListId === "");

  while (currentList !== undefined) {
    sortedLists.push(currentList);
    currentList = lists.find((list) => list.id === currentList!.nextListId);
  }

  const sortedListsWithSortedTasks: IList[] = [];

  sortedLists.forEach((list) => {
    sortedListsWithSortedTasks.push(sortTasks(list));
  });

  return sortedListsWithSortedTasks;
};

function sortTasks(list: IList): IList {
  const tasksSorted: ITask[] = [];
  let currentTask = list.tasks.find((task) => task.prevTaskId === "");

  while (currentTask !== undefined) {
    tasksSorted.push(currentTask);
    currentTask = list.tasks.find(
      (task) => task.id === currentTask!.nextTaskId
    );
  }

  return { ...list, tasks: tasksSorted };
}

export function sortComments(comments: IComment[]): IComment[] {
  return comments.sort((comment1, comment2) => {
    return comment1.timestamp - comment2.timestamp;
  });
}
