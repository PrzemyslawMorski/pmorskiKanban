import * as _ from "lodash";
import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router";
import { Dispatch } from "redux";
import { createBoard } from "../../actions/boardActions";
import { InputField } from "../../shared-components/Input/InputField";
import { Spinner } from "../../shared-components/Spinner/Spinner";
import { IState } from "../../store/storeStateInterface";

interface ICreateBoardPageProps {
  userLoggedIn: boolean;
  boardId: string | null;
  createBoard: (boardName: string) => void;
}

export class CreateBoardPage extends React.Component<ICreateBoardPageProps> {
  public state = {
    boardName: "",
    boardNameError: "",
    boardNameValid: false,
    creatingBoard: false,
    redirectToBoards: false,
  };

  constructor(props: ICreateBoardPageProps) {
    super(props);

    this.handleUserInput = this.handleUserInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.validateField = this.validateField.bind(this);
    this.throttledHandleSubmit = _.throttle(this.throttledHandleSubmit, 500);
    this.cancelEditBoardName = this.cancelEditBoardName.bind(this);
  }

  public render(): JSX.Element {
    if (!this.props.userLoggedIn) {
      return <Redirect to="/login" />;
    }

    if (this.props.boardId !== null) {
      return <Redirect to={"/board/" + this.props.boardId} />;
    }

    if (this.state.creatingBoard) {
      return <Spinner />;
    }

    if (this.state.redirectToBoards) {
      return <Redirect to="/boards" />;
    }

    return (
      <div className="w3-container" style={{ flex: "1", overflow: "auto" }}>
        <form
          className="w3-container w3-row w3-margin-top"
          onSubmit={this.handleSubmit}
        >
          <div className="w3-rest w3-mobile w3-hide-large w3-hide-medium w3-margin-bottom">
            <InputField
              name={"boardName"}
              onChange={this.handleUserInput}
              error={this.state.boardNameError}
              required={true}
              type={"text"}
              value={this.state.boardName}
              placeholder={"Enter a board name"}
            />
          </div>

          <div
            className="w3-container w3-col w3-right w3-mobile"
            style={{ width: "200px" }}
          >
            <button
              type="button"
              className="w3-button w3-red w3-left w3-round-large"
              onClick={this.cancelEditBoardName}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w3-button w3-theme-action w3-right w3-round-large"
              disabled={!this.state.boardNameValid}
            >
              Save
            </button>
          </div>

          <div className="w3-rest w3-hide-small">
            <InputField
              name={"boardName"}
              onChange={this.handleUserInput}
              error={this.state.boardNameError}
              required={true}
              type={"text"}
              value={this.state.boardName}
              placeholder={"Enter a board name"}
            />
          </div>
        </form>
      </div>
    );
  }

  private handleUserInput(event: React.FormEvent) {
    const name = (event.target as HTMLInputElement).name;
    const value = (event.target as HTMLInputElement).value;
    this.setState({ [name]: value }, () => {
      this.validateField(name, value as string);
    });
  }

  private validateField(fieldName: string, value: string) {
    let boardNameError = this.state.boardNameError;

    switch (fieldName) {
      case "boardName":
        boardNameError = value.length === 0 ? "Board name is required" : "";
        break;
      default:
        break;
    }
    this.setState({
      boardNameError,
      boardNameValid: boardNameError === "",
    });
  }

  private handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    this.throttledHandleSubmit();
  }

  private throttledHandleSubmit() {
    if (
      this.state.boardNameError !== "" ||
      !this.state.boardNameValid ||
      this.state.creatingBoard
    ) {
      return;
    }

    this.props.createBoard(this.state.boardName);
    this.setState({ creatingBoard: true });
  }

  private cancelEditBoardName() {
    this.setState({ redirectToBoards: true });
  }
}

const mapStateToProps = (state: IState) => ({
  boardId: state.board === null ? null : state.board.id,
  userLoggedIn: state.user !== null,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  createBoard: (boardName: string) => dispatch(createBoard(boardName)),
});

export const CreateBoard = connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateBoardPage);
