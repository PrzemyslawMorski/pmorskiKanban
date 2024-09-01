import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { hideModal } from "../../actions/modalActions";
import { IModal } from "../../entities/IModal";
import { IState } from "../../store/storeStateInterface";

interface IModalProps {
  modal: IModal | null;
  hideModal: () => void;
}

class ModalComponent extends React.Component<IModalProps> {
  public render() {
    if (this.props.modal !== null) {
      return (
        <div className="w3-modal w3-center" style={{ display: "block" }}>
          <div className="w3-modal-content w3-display-container w3-card-4 w3-round-large w3-border w3-border-black">
            <div>
              <i
                className="fa fa-times w3-display-topright"
                style={{
                  cursor: "pointer",
                  marginRight: "5px",
                  marginTop: "5px",
                }}
                onClick={this.props.hideModal}
              />
              {this.props.modal.content}
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
}

const mapStateToProps = (state: IState) => ({
  modal: state.modal,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  hideModal: () => dispatch(hideModal()),
});

export const Modal = connect(
  mapStateToProps,
  mapDispatchToProps
)(ModalComponent);
