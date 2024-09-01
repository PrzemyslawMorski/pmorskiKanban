import * as _ from "lodash";
import React from "react";
import { TextAreaField } from "../../../../shared-components/Input/TextArea";
import { Spinner } from "../../../../shared-components/Spinner/Spinner";

interface IAddCommentProps {
  onAddComment: (taskName: string) => void;
  waitingForACommentToBeAdded: boolean;
}

export class AddComment extends React.Component<IAddCommentProps> {
  public state = {
    addingComment: false,
    comment: "",
    commentError: "",
    commentValid: false,
  };

  constructor(props: IAddCommentProps) {
    super(props);

    this.addComment = this.addComment.bind(this);
    this.cancelAddComment = this.cancelAddComment.bind(this);

    this.handleUserInput = this.handleUserInput.bind(this);
    this.validateField = this.validateField.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.throttledHandleSubmit = _.throttle(this.throttledHandleSubmit, 500);
  }

  public render() {
    if (this.state.addingComment) {
      return (
        <form className="w3-margin-top" onSubmit={this.handleSubmit}>
          <div>
            <TextAreaField
              name={"comment"}
              onChange={this.handleUserInput}
              error={this.state.commentError}
              required={true}
              value={this.state.comment}
              placeholder={"Enter comment"}
            />
          </div>

          <div className="w3-margin-top">
            <button
              type="button"
              className="w3-button w3-red w3-round-large w3-margin-right"
              onClick={this.cancelAddComment}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w3-button w3-theme-action w3-round-large"
              disabled={!this.state.commentValid}
            >
              Save
            </button>
          </div>
        </form>
      );
    } else {
      const spinner = this.props.waitingForACommentToBeAdded ? (
        <div className="w3-display-right">
          <Spinner fontSize={"24px"} />
        </div>
      ) : null;

      return (
        <div className="w3-row w3-margin-top">
          <button
            className="w3-button w3-block w3-theme-action w3-round-large w3-display-container"
            onClick={this.addComment}
          >
            Add comment
            {spinner}
          </button>
        </div>
      );
    }
  }

  private addComment() {
    this.setState({
      addingComment: true,
      newComment: "",
      newContentError: "",
      newContentValid: false,
    });
  }

  private cancelAddComment() {
    this.setState({
      addingComment: false,
      newComment: "",
      newContentError: "",
      newContentValid: false,
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
    let commentError = this.state.commentError;

    switch (fieldName) {
      case "comment":
        commentError = value.length === 0 ? "Comment can't be empty" : "";
        break;
      default:
        break;
    }
    this.setState({
      commentError,
      commentValid: commentError === "",
    });
  }

  private handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    this.throttledHandleSubmit();
  }

  private throttledHandleSubmit() {
    if (this.state.commentError !== "" || !this.state.commentValid) {
      return;
    }
    this.props.onAddComment(this.state.comment);
    this.cancelAddComment();
  }
}

// export const AddComment = connect(mapStateToProps, mapDispatchToProps)(AddCommentComponent);
