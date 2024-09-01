import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { removeViewer } from "../../actions/boardActions";
import { showModal } from "../../actions/modalActions";
import { IDeleteViewerLocalRequest } from "../../dtos/viewers";
import { IBoard } from "../../entities/IBoard";
import { IModal } from "../../entities/IModal";
import { ConfirmDeleteSthModal } from "../../shared-components/Modal/generic/ConfirmDeleteSthModal";
import { UserMiniature } from "../../shared-components/UserMiniature";
import { IState } from "../../store/storeStateInterface";
import { BoardAddViewerForm } from "./BoardAddViewerForm";

interface IBoardViewersModalProps {
  board: IBoard | null;
  removeViewer: (request: IDeleteViewerLocalRequest) => void;
  showModal: (modal: IModal) => void;
}

const SHOW_TAB: string = "SHOW";
const ADD_TAB: string = "ADD";

class BoardViewersModalComponent extends React.Component<IBoardViewersModalProps> {
  public state = {
    currentTab: SHOW_TAB,
  };

  constructor(props: IBoardViewersModalProps) {
    super(props);

    this.addTab = this.addTab.bind(this);
    this.showTab = this.showTab.bind(this);
  }

  public render() {
    return (
      <div>
        {this.header()}
        {this.content()}
      </div>
    );
  }

  private header() {
    return (
      <div className="w3-row">
        <div className="w3-half">
          <button
            className="w3-button w3-block w3-theme-action"
            onClick={this.showTab}
          >
            Show all viewers
          </button>
        </div>

        <div className="w3-half">
          <button
            className="w3-button w3-block w3-theme-action"
            onClick={this.addTab}
          >
            Find and add a viewer
          </button>
        </div>
      </div>
    );
  }

  private showTab() {
    if (this.state.currentTab !== SHOW_TAB) {
      this.setState({ currentTab: SHOW_TAB });
    }
  }

  private addTab() {
    if (this.state.currentTab !== ADD_TAB) {
      this.setState({ currentTab: ADD_TAB });
    }
  }

  private deleteViewer(viewerUid: string) {
    const deletedViewer = this.props.board!.viewers!.find(
      (viewer) => viewer.uid === viewerUid
    );

    if (deletedViewer === undefined) {
      return;
    }

    const request: IDeleteViewerLocalRequest = {
      boardId: this.props.board!.id,
      user: deletedViewer,
    };

    const showBoardViewersModal = () => {
      const membersModal: IModal = {
        content: <BoardViewersModal />,
        type: "MODAL_TYPE_BOARD_VIEWERS",
      };
      this.props.showModal(membersModal);
    };

    const proceedWithDeleteAndShowBoardViewersModal = () => {
      this.props.removeViewer(request);
      showBoardViewersModal();
    };

    const confirmRemoveViewerModal: IModal = {
      content: (
        <ConfirmDeleteSthModal
          confirmDeleteMessage={"Are you sure you want to remove this viewer?"}
          onDeleteClicked={proceedWithDeleteAndShowBoardViewersModal}
          onCloseClicked={showBoardViewersModal}
        />
      ),
      type: "MODAL_TYPE_VIEWER_DELETE_CONFIRMATION",
    };

    this.props.showModal(confirmRemoveViewerModal);
  }

  private content() {
    if (this.state.currentTab === ADD_TAB) {
      return <BoardAddViewerForm />;
    } else {
      const viewers = this.props.board!.viewers!.map((user) => {
        const localRemoveViewer = () => {
          this.deleteViewer(user.uid);
        };

        return (
          <div className="w3-row" key={user.uid}>
            <div className="w3-col w3-right" style={{ width: "50px" }}>
              <i
                className="w3-button fa fa-times w3-red w3-hover-red w3-round-large"
                onClick={localRemoveViewer}
                style={{ marginBottom: "5px" }}
              />
            </div>
            <div className="w3-rest">
              <UserMiniature
                userName={user.displayName}
                photoUrl={user.photoURL}
              />
            </div>
          </div>
        );
      });

      return viewers.length > 0 ? (
        <div className="w3-container w3-margin-top w3-margin-bottom">
          <h5 style={{ textAlign: "left" }}>Your board's viewers:</h5>
          <ul className="w3-ul">{viewers}</ul>
        </div>
      ) : (
        <div className="w3-container w3-margin-top w3-margin-bottom">
          <span className="w3-text-theme" style={{ textAlign: "left" }}>
            Your board has no viewers.
          </span>
        </div>
      );
    }
  }
}

const mapStateToProps = (state: IState) => ({
  board: state.board,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  removeViewer: (request: IDeleteViewerLocalRequest) =>
    dispatch(removeViewer(request)),
  showModal: (modal: IModal) => dispatch(showModal(modal)),
});

export const BoardViewersModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(BoardViewersModalComponent);
