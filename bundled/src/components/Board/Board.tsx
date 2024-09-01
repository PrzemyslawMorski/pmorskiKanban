import React from "react";
import {
  DragDropContext,
  Draggable,
  DraggableProvided,
  Droppable,
  DroppableProvided,
  DropResult,
} from "react-beautiful-dnd";
import { connect } from "react-redux";
import { Redirect, RouteComponentProps } from "react-router";
import { withRouter } from "react-router-dom";
import { Dispatch } from "redux";
import { getBoard, renameBoard } from "../../actions/boardActions";
import { createList, moveList } from "../../actions/listActions";
import { moveTask } from "../../actions/taskActions";
import {
  IMoveListLocalRequest,
  IMoveTaskLocalRequest,
} from "../../dtos/moveList";
import { IBoard } from "../../entities/IBoard";
import { IList } from "../../entities/IList";
import { Spinner } from "../../shared-components/Spinner/Spinner";
import { BoardHeader } from "./BoardHeader";
import { CreateList } from "./CreateList";
import { KanbanList } from "./List/List";
import { IState } from "../../store/storeStateInterface";

interface IBoardPageUrlParams {
  boardId: string;
}

type BoardPageProps = RouteComponentProps<IBoardPageUrlParams> & {
  board: IBoard | null;
  isListBeingAdded: boolean;
  listsWaitingToBeDeleted: Array<{ boardId: string; listId: string }>;
  createList: (boardId: string, listName: string) => void;
  getBoard: (boardId: string) => void;
  renameBoard: (
    boardId: string,
    oldBoardName: string,
    newBoardName: string
  ) => void;
  userLoggedIn: boolean;
  moveList: (request: IMoveListLocalRequest) => void;
  moveTask: (request: IMoveTaskLocalRequest) => void;
};

const listsContainerStyles: React.CSSProperties = {
  display: "flex",
  flex: "1",
  flexDirection: "row",
  flexWrap: "nowrap",
  overflow: "auto",
};

export class BoardPage extends React.Component<BoardPageProps> {
  constructor(props: BoardPageProps) {
    super(props);

    const boardIdFromUrl: string = props.match.params.boardId;
    const boardShouldBeLoaded: boolean =
      props.board === null || props.board.id !== props.match.params.boardId;

    if (
      boardShouldBeLoaded &&
      boardIdFromUrl !== null &&
      boardIdFromUrl !== "" &&
      boardIdFromUrl !== undefined
    ) {
      props.getBoard(boardIdFromUrl);
    }

    this.createListCallback = this.createListCallback.bind(this);
    this.renameBoardCallback = this.renameBoardCallback.bind(this);

    this.onDragEnd = this.onDragEnd.bind(this);
  }

  public render(): JSX.Element {
    if (!this.props.userLoggedIn) {
      return <Redirect to="/login" />;
    }

    const boardLoading: boolean =
      this.props.board === null ||
      this.props.board.id !== this.props.match.params.boardId;
    if (boardLoading) {
      return <Spinner />;
    }

    return (
      <div
        style={{
          flex: "1",
          display: "flex",
          flexFlow: "column",
          height: "100%",
          width: "100%",
        }}
      >
        <div
          className="w3-container"
          style={{ flex: "0 1 50px", width: "100%" }}
        >
          <BoardHeader
            currentBoardName={this.props.board!.name}
            onRenameBoard={this.renameBoardCallback}
            editingAllowed={this.props.board!.owner}
          />
        </div>
        <div style={{ display: "flex", flexFlow: "column", flex: "1" }}>
          {this.listsContainer()}
        </div>
      </div>
    );
  }

  private onDragEnd(result: DropResult) {
    if (this.props.board === null) {
      return;
    }

    if (result.destination === null) {
      return;
    }

    if (
      result.source.droppableId === result.destination!.droppableId &&
      result.source.index === result.destination!.index
    ) {
      return;
    }

    if (result.type === "LIST") {
      const listId = result.draggableId;

      const oldPosition = result.source.index;
      const newPosition = result.destination!.index;

      const movedList = this.props.board!.lists.find(
        (someList) => someList.id === listId
      );
      if (movedList === undefined) {
        return;
      }

      const oldPrevListIndex = oldPosition - 1;
      const oldPrevList =
        oldPrevListIndex >= 0
          ? this.props.board!.lists[oldPrevListIndex]
          : null;
      const oldPrevListId = oldPrevList !== null ? oldPrevList.id : "";

      const oldNextListIndex = oldPosition + 1;
      const oldNextList =
        oldNextListIndex < this.props.board!.lists.length
          ? this.props.board!.lists[oldNextListIndex]
          : null;
      const oldNextListId = oldNextList !== null ? oldNextList.id : "";

      const listMovedRight = newPosition > oldPosition;

      const newPrevListIndex = listMovedRight ? newPosition : newPosition - 1;
      const newPrevList =
        newPrevListIndex >= 0
          ? this.props.board!.lists[newPrevListIndex]
          : null;
      const newPrevListId = newPrevList !== null ? newPrevList.id : "";

      const newNextListIndex = listMovedRight ? newPosition + 1 : newPosition;
      const newNextList =
        newNextListIndex < this.props.board!.lists.length
          ? this.props.board!.lists[newNextListIndex]
          : null;
      const newNextListId = newNextList !== null ? newNextList.id : "";

      const request: IMoveListLocalRequest = {
        boardId: this.props.board!.id,
        listId,
        newPosition,
        oldPosition,
        srcNextListId: oldNextListId,
        srcPrevListId: oldPrevListId,
        targetNextListId: newNextListId,
        targetPrevListId: newPrevListId,
      };

      this.props.moveList(request);
    } else if (result.type === "TASK") {
      const taskId = result.draggableId;

      const srcListId = result.source.droppableId;
      const oldPosition = result.source.index;

      const targetListId = result.destination!.droppableId;
      const newPosition = result.destination!.index;

      const srcList = this.props.board!.lists.find(
        (someList) => someList.id === srcListId
      );
      if (srcList === undefined) {
        return;
      }

      const targetList = this.props.board!.lists.find(
        (someList) => someList.id === targetListId
      );
      if (targetList === undefined) {
        return;
      }

      const movedTask = srcList.tasks.find(
        (someTask) => someTask.id === taskId
      );
      if (movedTask === undefined) {
        return;
      }

      const oldPrevTaskIndex = oldPosition - 1;
      const oldPrevTask =
        oldPrevTaskIndex >= 0 ? srcList.tasks[oldPrevTaskIndex] : null;
      const oldPrevTaskId = oldPrevTask !== null ? oldPrevTask.id : "";

      const oldNextTaskIndex = oldPosition + 1;
      const oldNextTask =
        oldNextTaskIndex < srcList.tasks.length
          ? srcList.tasks[oldNextTaskIndex]
          : null;
      const oldNextTaskId = oldNextTask !== null ? oldNextTask.id : "";

      const sameList = srcListId === targetListId;
      const movedBottom = newPosition > oldPosition;

      const newPrevTaskIndex = sameList
        ? movedBottom
          ? newPosition
          : newPosition - 1
        : newPosition - 1;
      const newPrevTask =
        newPrevTaskIndex >= 0 ? targetList.tasks[newPrevTaskIndex] : null;
      const newPrevTaskId = newPrevTask !== null ? newPrevTask.id : "";

      const newNextTaskIndex = sameList
        ? movedBottom
          ? newPosition + 1
          : newPosition
        : newPosition;
      const newNextTask =
        newNextTaskIndex < targetList.tasks.length
          ? targetList.tasks[newNextTaskIndex]
          : null;
      const newNextTaskId = newNextTask !== null ? newNextTask.id : "";

      const request: IMoveTaskLocalRequest = {
        boardId: this.props.board!.id,
        listId: srcListId,
        newPosition,
        oldPosition,
        srcNextTaskId: oldNextTaskId,
        srcPrevTaskId: oldPrevTaskId,
        targetListId,
        targetNextTaskId: newNextTaskId,
        targetPrevTaskId: newPrevTaskId,
        taskId,
      };

      this.props.moveTask(request);
    }
  }

  private renameBoardCallback(boardName: string) {
    this.props.renameBoard(
      this.props.board!.id,
      this.props.board!.name,
      boardName
    );
  }

  private createListCallback(listName: string) {
    this.props.createList(this.props.board!.id, listName);
  }

  private listsContainer() {
    const isBeingDeleted = (listId: string) => {
      return (
        this.props.listsWaitingToBeDeleted.find(
          (boardList) =>
            boardList.boardId === this.props.board!.id &&
            boardList.listId === listId
        ) !== undefined
      );
    };

    if (this.props.board!.owner) {
      const draggableList = (
        dragProvided: DraggableProvided,
        someList: IList
      ) => (
        <div
          ref={dragProvided.innerRef}
          {...dragProvided.draggableProps}
          {...dragProvided.dragHandleProps}
        >
          <KanbanList
            boardId={this.props.board!.id}
            key={someList.id}
            list={someList}
            isBeingDeleted={isBeingDeleted(someList.id)}
            editingAllowed={this.props.board!.owner}
          />
        </div>
      );

      const draggableLists = this.props.board!.lists.map((someList, index) => (
        <Draggable key={someList.id} draggableId={someList.id} index={index}>
          {(dragProvided: DraggableProvided) =>
            draggableList(dragProvided, someList)
          }
        </Draggable>
      ));

      const droppableListsContainer = (provided: DroppableProvided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          style={listsContainerStyles}
        >
          {draggableLists}
          <div>{provided.placeholder}</div>
          <CreateList
            creatingList={this.props.isListBeingAdded}
            onCreateList={this.createListCallback}
          />
        </div>
      );

      return (
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable
            droppableId="board"
            type="LIST"
            direction="horizontal"
            ignoreContainerClipping={true}
          >
            {(provided) => droppableListsContainer(provided)}
          </Droppable>
        </DragDropContext>
      );
    } else {
      const nonDraggableLists = this.props.board!.lists.map((someList) => {
        return (
          <div key={someList.id}>
            <KanbanList
              boardId={this.props.board!.id}
              list={someList}
              isBeingDeleted={isBeingDeleted(someList.id)}
              editingAllowed={this.props.board!.owner}
            />
          </div>
        );
      });

      return <div style={listsContainerStyles}>{nonDraggableLists}</div>;
    }
  }
}

const mapStateToProps = (state: IState) => ({
  board: state.board,
  isListBeingAdded: state.isListBeingAdded,
  listsWaitingToBeDeleted: state.listsWaitingToBeDeleted,
  userLoggedIn: state.user !== null,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  createList: (boardId: string, listName: string) =>
    dispatch(createList(boardId, listName)),
  getBoard: (boardId: string) => dispatch(getBoard(boardId)),
  moveList: (request: IMoveListLocalRequest) => dispatch(moveList(request)),
  moveTask: (request: IMoveTaskLocalRequest) => dispatch(moveTask(request)),
  renameBoard: (boardId: string, oldBoardName: string, newBoardName: string) =>
    dispatch(renameBoard(boardId, oldBoardName, newBoardName)),
});

export const Board = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(BoardPage)
);
