import * as _ from "lodash";
import React from "react";
import { TextAreaField } from "../../../../shared-components/Input/TextArea";

interface ITaskCommentProps {
  editCommentCallback: (taskName: string) => void;
  deleteCommentCallback: () => void;
  currentComment: string;
  authorDisplayName: string;
  editingAllowed: boolean;
}

export class TaskComment extends React.Component<ITaskCommentProps> {
  public state = {
    editingComment: false,
    newComment: this.props.currentComment,
    newCommentError: "",
    newCommentValid: false,
  };

  constructor(props: ITaskCommentProps) {
    super(props);

    this.editContent = this.editContent.bind(this);
    this.cancelEditContent = this.cancelEditContent.bind(this);
    this.handleUserInput = this.handleUserInput.bind(this);
    this.validateField = this.validateField.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.throttledHandleSubmit = _.throttle(this.throttledHandleSubmit, 500);
  }

  public render() {
    if (this.state.editingComment && this.props.editingAllowed) {
      return (
        <form
          className="w3-row w3-margin-top"
          style={{ minHeight: "50px" }}
          onSubmit={this.handleSubmit}
        >
          <div
            className="w3-container w3-col w3-right w3-mobile w3-hide-small"
            style={{ width: "200px" }}
          >
            <button
              type="button"
              className="w3-button w3-red w3-left w3-round-large"
              onClick={this.cancelEditContent}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w3-button w3-theme-action w3-right w3-round-large"
              disabled={!this.state.newCommentValid}
            >
              Save
            </button>
          </div>
          <div className="w3-rest w3-mobile">
            <TextAreaField
              name={"newComment"}
              onChange={this.handleUserInput}
              error={this.state.newCommentError}
              required={true}
              value={this.state.newComment}
              placeholder={"Enter new comment's content"}
            />
          </div>

          <div
            className="w3-container w3-col w3-right w3-mobile w3-hide-medium w3-hide-large w3-margin-top"
            style={{ width: "200px" }}
          >
            <button
              type="button"
              className="w3-button w3-red w3-left w3-round-large"
              onClick={this.cancelEditContent}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w3-button w3-theme-action w3-right w3-round-large"
              disabled={!this.state.newCommentValid}
            >
              Save
            </button>
          </div>
        </form>
      );
    } else {
      const ellipsis: React.CSSProperties = {
        overflow: "hidden",
        textAlign: "left",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      };

      const ownerAuthorOptions = this.props.editingAllowed ? (
        <div
          className="w3-col w3-cell-row w3-margin-left w3-right"
          style={{ width: "100px" }}
        >
          <a className="w3-cell">
            <i
              className="w3-theme-action w3-button w3-round-large fa fa-edit"
              style={{ marginBottom: "5px" }}
              onClick={this.editContent}
            />
          </a>
          <i
            className="w3-button w3-cell fa fa-times w3-red w3-hover-red w3-round-large"
            onClick={this.props.deleteCommentCallback}
            style={{ marginBottom: "5px" }}
          />
        </div>
      ) : null;

      return (
        <li>
          <div style={ellipsis} className="w3-left">
            <b>{this.props.authorDisplayName}</b>
          </div>
          <div className="w3-row">
            {ownerAuthorOptions}
            <div className="w3-rest w3-margin-right" style={ellipsis}>
              <span>{this.props.currentComment}</span>
            </div>
          </div>
        </li>
      );
    }
  }

  private editContent() {
    this.setState({
      editingComment: true,
      newComment: this.props.currentComment,
    });
  }

  private cancelEditContent() {
    this.setState({
      editingComment: false,
      newComment: this.props.currentComment,
      newContentError: "",
    });
  }

  private handleUserInput(event: React.FormEvent) {
    const name = (event.target as HTMLInputElement).name;
    const value = (event.target as HTMLInputElement).value;
    this.setState({ [name]: value }, () => {
      this.validateField(name, value as string);
    });
  }

  private validateField(fieldName: string, value: string) {
    let newCommentError = this.state.newCommentError;

    switch (fieldName) {
      case "newComment":
        if (value.length === 0) {
          newCommentError = "Comment can't be empty";
        } else if (value === this.props.currentComment) {
          newCommentError =
            "New comment needs to be different than the current comment";
        } else {
          newCommentError = "";
        }
        break;
      default:
        break;
    }
    this.setState({
      newCommentError,
      newCommentValid: newCommentError === "",
    });
  }

  private handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    this.throttledHandleSubmit();
  }

  private throttledHandleSubmit() {
    if (this.state.newCommentError !== "" || !this.state.newCommentValid) {
      return;
    }
    this.props.editCommentCallback(this.state.newComment);
    this.setState({ editingComment: false, newCommentError: "" });
  }
}
