import React from "react";

interface IConfirmDeleteSthModal {
  confirmDeleteMessage: string;
  onDeleteClicked: () => void;
  onCloseClicked: () => void;
}

export const ConfirmDeleteSthModal: React.FC<IConfirmDeleteSthModal> = (
  props
) => {
  return (
    <div className="w3-margin-top w3-margin-bottom">
      <span className="w3-margin-right w3-mobile w3-margin-bottom">
        {props.confirmDeleteMessage}
      </span>
      <button
        className="w3-button w3-theme-action w3-round-large w3-margin-right"
        onClick={props.onCloseClicked}
      >
        Cancel
      </button>
      <button
        className="w3-button w3-red w3-round-large"
        onClick={props.onDeleteClicked}
      >
        Delete
      </button>
    </div>
  );
};
