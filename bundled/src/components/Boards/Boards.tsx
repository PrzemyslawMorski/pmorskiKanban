import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router";
import { Dispatch } from "redux";
import {
  deleteBoard,
  resetBoard,
  unsubBoard,
} from "../../actions/boardActions";
import { hideModal, showModal } from "../../actions/modalActions";
import { IDeleteBoardLocalRequest } from "../../dtos/local-requests";
import { IUnsubBoardLocalRequest } from "../../dtos/local-requests";
import { IAlert } from "../../entities/IAlert";
import { IBoardMiniature } from "../../entities/IBoardMiniature";
import { IModal } from "../../entities/IModal";
import { Spinner } from "../../shared-components/Spinner/Spinner";
import { IState } from "../../store/storeStateInterface";
import { BoardMiniature } from "./BoardMiniature";

interface IBoardsPageProps {
  boards: IBoardMiniature[] | null;
  userLoggedIn: boolean;
  boardNull: boolean;
  resetBoard: () => void;
  deleteBoard: (request: IDeleteBoardLocalRequest) => void;
  showModal: (modal: IModal) => void;
  hideModal: () => void;
  showAlert: (alert: IAlert) => void;
  unsubBoard: (request: IUnsubBoardLocalRequest) => void;
}

class BoardsPage extends React.Component<IBoardsPageProps> {
  public state = {
    userWantsToCreateBoard: false,
  };

  constructor(props: IBoardsPageProps) {
    super(props);
    this.createNewBoard = this.createNewBoard.bind(this);
    this.deleteBoard = this.deleteBoard.bind(this);
    this.unsubBoard = this.unsubBoard.bind(this);
  }

  public render(): JSX.Element {
    if (!this.props.userLoggedIn) {
      return <Redirect to="/login" />;
    }

    if (this.state.userWantsToCreateBoard && this.props.boardNull) {
      return <Redirect to="/board-create" />;
    }

    if (this.props.boards === null) {
      return <Spinner />;
    }

    const ownedBoards = this.props.boards
      .filter((board: IBoardMiniature) => board.owner)
      .map((board: IBoardMiniature) => {
        const localDelete = () => {
          this.deleteBoard(board);
        };

        return (
          <BoardMiniature
            key={board.id}
            board={board}
            onDeleteCallback={localDelete}
            showModal={this.props.showModal}
            hideModal={this.props.hideModal}
          />
        );
      });

    const viewedBoards = this.props.boards
      .filter((board: IBoardMiniature) => !board.owner)
      .map((board: IBoardMiniature) => (
        <BoardMiniature
          key={board.id}
          board={board}
          onDeleteCallback={this.unsubBoard}
          showModal={this.props.showModal}
          hideModal={this.props.hideModal}
        />
      ));

    return (
      <div
        className={"w3-panel"}
        style={{
          flex: "1",
          display: "flex",
          flexFlow: "column",
          height: "100%",
          width: "100%",
          overflow: "auto",
        }}
      >
        <div style={{ flex: "0 1 auto" }}>
          <div className="w3-cell-row">
            <div className="w3-cell w3-rest">
              <h3>Your owned boards</h3>
            </div>
            <div className="w3-cell" style={{ width: "100px" }}>
              <button
                className="w3-button w3-theme-action w3-round-large"
                onClick={this.createNewBoard}
              >
                Create new board
              </button>
            </div>
          </div>
          <ul className="w3-ul w3-hoverable">{ownedBoards}</ul>
        </div>

        <div style={{ flex: "0 1 auto" }}>
          <div className="w3-cell-row">
            <div className="w3-cell w3-rest">
              <h3>Your viewed boards</h3>
            </div>
          </div>
          <ul className="w3-ul w3-hoverable">{viewedBoards}</ul>
        </div>
      </div>
    );
  }

  private createNewBoard() {
    this.props.resetBoard();
    this.setState({ userWantsToCreateBoard: true });
  }

  private deleteBoard(board: IBoardMiniature) {
    const request: IDeleteBoardLocalRequest = {
      board,
    };

    this.props.deleteBoard(request);
  }

  private unsubBoard(boardId: string) {
    const unsubbedBoard = this.props.boards!.find(
      (board) => board.id === boardId
    );
    if (unsubbedBoard === undefined) {
      return;
    }
    const request: IUnsubBoardLocalRequest = {
      board: unsubbedBoard,
    };
    this.props.unsubBoard(request);
  }
}

function mapStateToProps(state: IState) {
  return {
    boardNull: state.board === null,
    boards: state.boards,
    userLoggedIn: state.user !== null,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    deleteBoard: (request: IDeleteBoardLocalRequest) =>
      dispatch(deleteBoard(request)),
    hideModal: () => dispatch(hideModal()),
    resetBoard: () => dispatch(resetBoard()),
    showModal: (modal: IModal) => dispatch(showModal(modal)),
    unsubBoard: (request: IUnsubBoardLocalRequest) =>
      dispatch(unsubBoard(request)),
  };
}

export const Boards = connect(mapStateToProps, mapDispatchToProps)(BoardsPage);
