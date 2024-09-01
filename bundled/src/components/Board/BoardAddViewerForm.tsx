import * as _ from "lodash";
import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { Subscription } from "rxjs";
import { showAlert } from "../../actions/alertActions";
import { addViewer } from "../../actions/boardActions";
import {
  IAddViewerLocalRequest,
} from "../../dtos/viewers";
import { IAlert } from "../../entities/IAlert";
import { IBoard } from "../../entities/IBoard";
import { IUser } from "../../entities/IUser";
import { searchUsersByEmail } from "../../services/viewersService";
import { InputField } from "../../shared-components/Input/InputField";
import { Spinner } from "../../shared-components/Spinner/Spinner";
import { UserMiniature } from "../../shared-components/UserMiniature";
import { IState } from "../../store/storeStateInterface";
import { ISearchUsersRequest } from "../../dtos/requests";
import { ISearchUsersResponse } from "../../dtos/responses";

interface IBoardAddViewerFormProps {
  board: IBoard | null;
  addViewer: (request: IAddViewerLocalRequest) => void;
  showAlert: (alert: IAlert) => void;
}

class BoardAddViewerFormComponent extends React.Component<IBoardAddViewerFormProps> {
  private static handleSubmit(event: React.FormEvent) {
    event.preventDefault();
  }

  public state: {
    foundUsers: IUser[];
    currentSearchPhrase: string;
    searchPhraseFromForm: string;
  } = {
    currentSearchPhrase: "",
    foundUsers: [],
    searchPhraseFromForm: "",
  };
  private findUsersSubscription: Subscription | null = null;

  constructor(props: IBoardAddViewerFormProps) {
    super(props);
    this.handleUserInput = this.handleUserInput.bind(this);
    this.throttledGetViewers = _.throttle(this.throttledGetViewers, 500);
    this.addViewer = this.addViewer.bind(this);
  }

  public render() {
    const searchingForUsers =
      this.state.searchPhraseFromForm !== this.state.currentSearchPhrase;

    const foundUsersListContent =
      this.state.foundUsers.length > 0 ? (
        this.state.foundUsers.map((user) => {
          const localAddViewer = () => {
            this.addViewer(user);
          };

          return (
            <li key={user.uid} className="w3-row">
              <div className="w3-col w3-right" style={{ width: "50px" }}>
                <i
                  className="w3-button fa fa-plus w3-theme-action w3-round-large"
                  onClick={localAddViewer}
                  style={{ marginBottom: "5px" }}
                />
              </div>
              <div className="w3-rest">
                <UserMiniature
                  userName={user.displayName}
                  photoUrl={user.photoURL}
                />
              </div>
            </li>
          );
        })
      ) : (
        <span className="w3-text-theme">No users found.</span>
      );

    const foundUsersDiv =
      this.state.searchPhraseFromForm !== "" ? (
        !searchingForUsers ? (
          <div>
            <h5 style={{ textAlign: "left" }}>Found users:</h5>
            <ul className="w3-ul">{foundUsersListContent}</ul>
          </div>
        ) : (
          <div>
            <Spinner />
          </div>
        )
      ) : null;

    return (
      <div className="w3-container w3-margin-top w3-margin-bottom">
        <form onSubmit={BoardAddViewerFormComponent.handleSubmit}>
          <InputField
            name={"searchPhraseFromForm"}
            label={"Search for a user by email (max. 10 users)"}
            onChange={this.handleUserInput}
            type={"text"}
            placeholder={"Search for a user by email"}
          />
        </form>
        {foundUsersDiv}
      </div>
    );
  }

  private handleUserInput(event: React.FormEvent) {
    const name = (event.target as HTMLInputElement).name;
    const value = (event.target as HTMLInputElement).value;
    this.setState({ [name]: value }, this.throttledGetViewers);
  }

  private throttledGetViewers() {
    if (this.state.searchPhraseFromForm === "") {
      // input empty
      this.setState({ foundUsers: [] });
      if (this.findUsersSubscription !== null) {
        this.findUsersSubscription.unsubscribe();
        this.findUsersSubscription = null;
      }
    } else {
      // new value from form
      if (this.state.searchPhraseFromForm !== this.state.currentSearchPhrase) {
        // there is need to search for users
        if (this.findUsersSubscription !== null) {
          // if already searching, forget old search
          this.findUsersSubscription.unsubscribe();
          this.findUsersSubscription = null;
        }
        // start next search
        const request: ISearchUsersRequest = {
          boardId: this.props.board!.id,
          phrase: this.state.searchPhraseFromForm,
        };
        this.findUsersSubscription = searchUsersByEmail(request).subscribe(
          (next: ISearchUsersResponse) => {
            if (this.findUsersSubscription !== null) {
              this.findUsersSubscription.unsubscribe();
              this.findUsersSubscription = null;
              this.setState({
                currentSearchPhrase: request.phrase,
                foundUsers: next.users,
              });
            }
          },
          (error) => {
            const alert: IAlert = {
              color: "w3-red",
              duration: 5000,
              text: error.code,
            };
            this.props.showAlert(alert);

            if (this.findUsersSubscription !== null) {
              this.findUsersSubscription.unsubscribe();
              this.findUsersSubscription = null;
              this.setState({
                currentSearchPhrase: request.phrase,
                foundUsers: [],
              });
            }
          }
        );
      }
    }
  }

  private addViewer(user: IUser) {
    const newFoundUsers = this.state.foundUsers;
    const addedUserIndex = newFoundUsers.indexOf(user);

    if (addedUserIndex !== -1) {
      newFoundUsers.splice(addedUserIndex, 1);
      this.setState({ foundUsers: newFoundUsers });
    }

    const request: IAddViewerLocalRequest = {
      boardId: this.props.board!.id,
      user,
    };
    this.props.addViewer(request);
  }
}

const mapStateToProps = (state: IState) => ({
  board: state.board,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  addViewer: (request: IAddViewerLocalRequest) => dispatch(addViewer(request)),
  showAlert: (alert: IAlert) => dispatch(showAlert(alert)),
});

export const BoardAddViewerForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(BoardAddViewerFormComponent);
