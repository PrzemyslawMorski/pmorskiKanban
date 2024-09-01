import * as _ from "lodash";
import React from "react";
import { Link } from "react-router-dom";
import { IBoardMiniature } from "../../entities/IBoardMiniature";
import { IModal } from "../../entities/IModal";
import { ConfirmDeleteSthModal } from "../../shared-components/Modal/generic/ConfirmDeleteSthModal";

interface IBoardMiniatureProps {
  board: IBoardMiniature;
  onDeleteCallback: (boardId: string) => void;
  showModal: (modal: IModal) => void;
  hideModal: () => void;
}

export const BoardMiniature: React.FC<IBoardMiniatureProps> = (props) => {
  const onDelete = () => {
    const onModalDeleteClicked = () => {
      props.onDeleteCallback(props.board.id);
      props.hideModal();
    };

    const onModalCloseClicked = () => {
      props.hideModal();
    };

    const modalText = props.board.owner
      ? "Are you sure you want to delete this board?"
      : "Are you sure you want to stop viewing this board?";

    const deleteBoardModal: IModal = {
      content: (
        <ConfirmDeleteSthModal
          confirmDeleteMessage={modalText}
          onDeleteClicked={onModalDeleteClicked}
          onCloseClicked={onModalCloseClicked}
        />
      ),
      type: "MODAL_TYPE_BOARD_DELETE_CONFIRMATION",
    };

    props.showModal(deleteBoardModal);
  };
  const throttledOnDelete = _.throttle(onDelete, 500);

  const deleteButtonContent = props.board.owner ? (
    <button
      className="w3-button w3-red w3-hover-red w3-round-large"
      style={{ width: "100%" }}
      onClick={throttledOnDelete}
    >
      <i className="fa fa-times w3-margin-right" />
      Delete
    </button>
  ) : (
    <button
      className="w3-button w3-red w3-hover-red w3-round-large"
      style={{ width: "100%" }}
      onClick={throttledOnDelete}
    >
      Unsubscribe
    </button>
  );

  return (
    <li className="w3-row">
      <div className="w3-col w3-right w3-hide-small" style={{ width: "150px" }}>
        {deleteButtonContent}
      </div>

      <div
        className="w3-col w3-right w3-hide-medium w3-hide-large"
        style={{ width: "30px" }}
      >
        <button
          className="w3-button w3-red w3-hover-red w3-round-large"
          onClick={throttledOnDelete}
        >
          <i className="fa fa-times" />
        </button>
      </div>

      <div className="w3-rest">
        <Link
          to={"/board/" + props.board.id}
          className="w3-button w3-block w3-left-align"
          style={{
            width: "100%",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            overflow: "hidden",
          }}
        >
          {props.board.name}
        </Link>
      </div>
    </li>
  );
};
