import * as _ from "lodash";
import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { hideModal, showModal } from "../../actions/modalActions";
import { IModal } from "../../entities/IModal";
import { InputField } from "../../shared-components/Input/InputField";
import { BoardViewersModal } from "./BoardViewers";

interface IBoardNameProps {
  onRenameBoard: (boardName: string) => void;
  currentBoardName: string;
  editingAllowed: boolean;
  showModal: (modal: IModal) => void;
  hideModal: () => void;
}

class BoardHeaderComponent extends React.Component<IBoardNameProps> {
  public state = {
    editingBoardName: false,
    newBoardName: this.props.currentBoardName,
    newBoardNameError: "",
    newBoardNameValid: false,
  };

  constructor(props: IBoardNameProps) {
    super(props);

    this.editBoardName = this.editBoardName.bind(this);
    this.cancelEditBoardName = this.cancelEditBoardName.bind(this);
    this.handleUserInput = this.handleUserInput.bind(this);
    this.validateField = this.validateField.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.throttledHandleSubmit = _.throttle(this.throttledHandleSubmit, 500);

    this.showMembers = this.showMembers.bind(this);
  }

  public render() {
    if (this.state.editingBoardName && this.props.editingAllowed) {
      return (
        <form className="w3-row w3-margin-top" onSubmit={this.handleSubmit}>
          <div
            className="w3-col w3-right w3-hide-small w3-margin-left"
            style={{ width: "200px" }}
          >
            <button
              type="button"
              className="w3-button w3-red w3-round-large w3-margin-right"
              onClick={this.cancelEditBoardName}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w3-button w3-theme-action w3-round-large"
              disabled={!this.state.newBoardNameValid}
            >
              Save
            </button>
          </div>
          <div className="w3-rest w3-mobile">
            <InputField
              name={"newBoardName"}
              onChange={this.handleUserInput}
              error={this.state.newBoardNameError}
              required={true}
              type={"text"}
              value={this.state.newBoardName}
              placeholder={"Enter new board name"}
            />
          </div>

          <div
            className="w3-right w3-mobile w3-hide-medium w3-hide-large w3-margin-top"
            style={{ width: "200px" }}
          >
            <button
              type="button"
              className="w3-button w3-red w3-round-large w3-margin-right"
              onClick={this.cancelEditBoardName}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w3-button w3-theme-action w3-round-large"
              disabled={!this.state.newBoardNameValid}
            >
              Save
            </button>
          </div>
        </form>
      );
    } else {
      const editBoardNameButtonMediumLargeScreen = this.props.editingAllowed ? (
        <div
          className="w3-col w3-cell-row w3-right w3-hide-small"
          style={{ width: "200px" }}
        >
          <div className="w3-cell">
            <button
              className="w3-button w3-theme-action w3-round-large"
              onClick={this.editBoardName}
            >
              Rename
            </button>
          </div>
          <div className="w3-cell">
            <button
              className="w3-button w3-theme-action w3-round-large"
              onClick={this.showMembers}
            >
              Viewers
            </button>
          </div>
        </div>
      ) : null;
      const editBoardNameButtonSmallScreen = this.props.editingAllowed ? (
        <div
          className="w3-col w3-cell-row w3-mobile w3-hide-medium w3-hide-large"
          style={{ width: "150px" }}
        >
          <div className="w3-cell w3-margin-right">
            <button
              className="w3-button w3-theme-action w3-round-large"
              onClick={this.editBoardName}
            >
              Rename
            </button>
          </div>
          <div className="w3-cell">
            <button
              className="w3-button w3-theme-action w3-round-large"
              onClick={this.showMembers}
            >
              Viewers
            </button>
          </div>
        </div>
      ) : null;

      return (
        <div className="w3-row w3-margin-top">
          {editBoardNameButtonMediumLargeScreen}

          <div className="w3-rest w3-mobile">
            <h4
              className="w3-left"
              style={{
                width: "100%",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
            >
              {this.props.currentBoardName}
            </h4>
          </div>

          {editBoardNameButtonSmallScreen}
        </div>
      );
    }
  }

  private editBoardName() {
    this.setState({
      editingBoardName: true,
      newBoardName: this.props.currentBoardName,
    });
  }

  private cancelEditBoardName() {
    this.setState({
      editingBoardName: false,
      newBoardName: this.props.currentBoardName,
      newBoardNameError: "",
    });
  }

  private showMembers() {
    const membersModal: IModal = {
      content: <BoardViewersModal />,
      type: "MODAL_TYPE_BOARD_VIEWERS",
    };
    this.props.showModal(membersModal);
  }

  private handleUserInput(event: React.FormEvent) {
    const name = (event.target as HTMLInputElement).name;
    const value = (event.target as HTMLInputElement).value;
    this.setState({ [name]: value }, () => {
      this.validateField(name, value as string);
    });
  }

  private validateField(fieldName: string, value: string) {
    let newBoardNameError = this.state.newBoardNameError;

    switch (fieldName) {
      case "newBoardName":
        if (value.length === 0) {
          newBoardNameError = "New board name is required";
        } else if (value === this.props.currentBoardName) {
          newBoardNameError =
            "New board name needs to be different than the current board name";
        } else {
          newBoardNameError = "";
        }
        break;
      default:
        break;
    }
    this.setState({
      newBoardNameError,
      newBoardNameValid: newBoardNameError === "",
    });
  }

  private handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    this.throttledHandleSubmit();
  }

  private throttledHandleSubmit() {
    if (this.state.newBoardNameError !== "" || !this.state.newBoardNameValid) {
      return;
    }
    this.props.onRenameBoard(this.state.newBoardName);
    this.setState({
      editingBoardName: false,
      newBoardNameError: "",
      newBoardNameValid: false,
    });
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  hideModal: () => dispatch(hideModal()),
  showModal: (modal: IModal) => dispatch(showModal(modal)),
});

export const BoardHeader = connect(
  undefined,
  mapDispatchToProps
)(BoardHeaderComponent);
