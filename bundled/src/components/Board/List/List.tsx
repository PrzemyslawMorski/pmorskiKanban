import * as React from "react";
import {
  Draggable,
  DraggableProvided,
  Droppable,
  DroppableProvided,
  DroppableStateSnapshot,
} from "react-beautiful-dnd";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { deleteList, renameList } from "../../../actions/listActions";
import { hideModal, showModal } from "../../../actions/modalActions";
import { createTask } from "../../../actions/taskActions";
import { IList } from "../../../entities/IList";
import { IModal } from "../../../entities/IModal";
import { ITask } from "../../../entities/ITask";
import { ConfirmDeleteSthModal } from "../../../shared-components/Modal/generic/ConfirmDeleteSthModal";
import { Spinner } from "../../../shared-components/Spinner/Spinner";
import { IState } from "../../../store/storeStateInterface";
import { CreateTask } from "./CreateTask";
import { RenameListModal } from "./RenameList";
import { KanbanTask } from "./Task/Task";

interface IListComponentProps {
  boardId: string;
  list: IList;
  isBeingDeleted: boolean;
  editingAllowed: boolean;
  renameList: (
    boardId: string,
    listId: string,
    oldListName: string,
    newListName: string
  ) => void;
  deleteList: (boardId: string, listId: string) => void;
  createTask: (boardId: string, listId: string, taskName: string) => void;
  showModal: (modal: IModal) => void;
  hideModal: () => void;
  listsWaitingForTasksToBeAdded: Array<{ boardId: string; listId: string }>;
  tasksWaitingToBeDeleted: Array<{
    boardId: string;
    listId: string;
    taskId: string;
  }>;
}

const listStyles: React.CSSProperties = {
  maxWidth: "60vw",
  width: "300px",
};

const tasksContainerStyles: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  margin: "0px 3px 0px 3px",
  minHeight: "40px",
};

class ListComponent extends React.Component<IListComponentProps> {
  constructor(props: IListComponentProps) {
    super(props);

    this.renameList = this.renameList.bind(this);
    this.deleteList = this.deleteList.bind(this);
    this.onTaskCreate = this.onTaskCreate.bind(this);
  }

  public render() {
    const waitingForATaskToBeCreated =
      this.props.listsWaitingForTasksToBeAdded.find(
        (boardList) =>
          boardList.boardId === this.props.boardId &&
          boardList.listId === this.props.list.id
      ) !== undefined;

    const createTaskButton = this.props.editingAllowed ? (
      <div className="w3-margin">
        <CreateTask
          waitingForATaskToBeAdded={waitingForATaskToBeCreated}
          onCreateTask={this.onTaskCreate}
          parentListId={this.props.list.id}
        />
      </div>
    ) : null;

    const spinner = this.props.isBeingDeleted ? (
      <div className="w3-display-topright">
        <Spinner fontSize={"15px"} />
      </div>
    ) : null;

    return (
      <div
        className="w3-border w3-border-gray w3-theme-l4 w3-margin w3-round-large w3-display-container"
        style={listStyles}
      >
        {spinner}
        {this.listHeader()}
        {this.tasksContainer()}
        {createTaskButton}
      </div>
    );
  }

  private tasksContainer() {
    const isBeingDeleted = (taskId: string) => {
      return (
        this.props.tasksWaitingToBeDeleted.find(
          (boardListTask) =>
            boardListTask.boardId === this.props.boardId &&
            boardListTask.listId === this.props.list.id &&
            boardListTask.taskId === taskId
        ) !== undefined
      );
    };

    if (this.props.editingAllowed) {
      const task = (dragProvided: DraggableProvided, someTask: ITask) => (
        <div
          ref={dragProvided.innerRef}
          {...dragProvided.draggableProps}
          {...dragProvided.dragHandleProps}
        >
          <KanbanTask
            boardId={this.props.boardId}
            listId={this.props.list.id}
            editingAllowed={this.props.editingAllowed}
            isBeingDeleted={isBeingDeleted(someTask.id)}
            key={someTask.id}
            task={someTask}
          />
        </div>
      );

      const tasks = this.props.list.tasks.map(
        (someTask: ITask, index: number) => (
          <Draggable draggableId={someTask.id} index={index} key={someTask.id}>
            {(dragProvided: DraggableProvided) => task(dragProvided, someTask)}
          </Draggable>
        )
      );

      const tasksContainerClass = (isDraggingOver: boolean) => {
        if (isDraggingOver) {
          return " w3-theme-l3";
        } else {
          return "";
        }
      };

      const tasksContainer = (
        provided: DroppableProvided,
        snapshot: DroppableStateSnapshot
      ) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          style={tasksContainerStyles}
          className={
            "w3-round-large" + tasksContainerClass(snapshot.isDraggingOver)
          }
        >
          {tasks}
          <div>{provided.placeholder}</div>
        </div>
      );
      return (
        <Droppable droppableId={this.props.list.id} type="TASK">
          {(provided, snapshot) => tasksContainer(provided, snapshot)}
        </Droppable>
      );
    } else {
      const tasks = this.props.list.tasks.map((someTask: ITask) => (
        <KanbanTask
          boardId={this.props.boardId}
          listId={this.props.list.id}
          editingAllowed={this.props.editingAllowed}
          isBeingDeleted={isBeingDeleted(someTask.id)}
          key={someTask.id}
          task={someTask}
        />
      ));

      return (
        <div style={tasksContainerStyles} className="w3-round-large">
          {tasks}
        </div>
      );
    }
  }

  private listHeader(): JSX.Element {
    const listOptions = this.props.editingAllowed ? (
      <div className="w3-col s1 l1 m1 w3-dropdown-hover">
        <i className="fa fa-ellipsis-h" />
        <div className="w3-dropdown-content w3-border w3-card w3-bar-block">
          <div className="w3-bar-item w3-button" onClick={this.renameList}>
            Rename
          </div>
          <div className="w3-bar-item w3-button" onClick={this.deleteList}>
            Delete
          </div>
        </div>
      </div>
    ) : null;

    return (
      <div className="w3-row-padding">
        <div className="w3-col s11 l11 m11">
          <h4
            className="w3-left-align"
            style={{ width: "95%", wordWrap: "break-word" }}
          >
            {this.props.list.name}
          </h4>
        </div>

        {listOptions}
      </div>
    );
  }

  private renameList() {
    const onListRenameComplete = (newListName: string) => {
      this.props.renameList(
        this.props.boardId,
        this.props.list.id,
        this.props.list.name,
        newListName
      );
      this.props.hideModal();
    };

    const onModalCloseClicked = () => {
      this.props.hideModal();
    };

    const renameListModal: IModal = {
      content: (
        <RenameListModal
          currentListName={this.props.list.name}
          onCloseClicked={onModalCloseClicked}
          onRenameComplete={onListRenameComplete}
        />
      ),
      type: "MODAL_TYPE_LIST_RENAME",
    };

    this.props.showModal(renameListModal);
  }

  private deleteList() {
    const onModalDeleteClicked = () => {
      this.props.deleteList(this.props.boardId, this.props.list.id);
      this.props.hideModal();
    };

    const onModalCloseClicked = () => {
      this.props.hideModal();
    };

    const deleteListModal: IModal = {
      content: (
        <ConfirmDeleteSthModal
          confirmDeleteMessage={"Are you sure you want to delete this list?"}
          onDeleteClicked={onModalDeleteClicked}
          onCloseClicked={onModalCloseClicked}
        />
      ),
      type: "MODAL_TYPE_LIST_DELETE_CONFIRMATION",
    };

    this.props.showModal(deleteListModal);
  }

  private onTaskCreate(taskName: string) {
    this.props.createTask(
      this.props.list.boardId,
      this.props.list.id,
      taskName
    );
  }
}

const mapStateToProps = (state: IState) => ({
  listsWaitingForTasksToBeAdded: state.listsWaitingForTasksToBeAdded,
  tasksWaitingToBeDeleted: state.tasksWaitingToBeDeleted,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  createTask: (boardId: string, listId: string, taskName: string) =>
    dispatch(createTask(boardId, listId, taskName)),
  deleteList: (boardId: string, listId: string) =>
    dispatch(deleteList(boardId, listId)),
  hideModal: () => dispatch(hideModal()),
  renameList: (
    boardId: string,
    listId: string,
    oldListName: string,
    newListName: string
  ) => dispatch(renameList(boardId, listId, oldListName, newListName)),
  showModal: (modal: IModal) => dispatch(showModal(modal)),
});

export const KanbanList = connect(
  mapStateToProps,
  mapDispatchToProps
)(ListComponent);
