import { Reducer } from "redux";
import { ActionType } from "typesafe-actions";
import { HIDE_MODAL, SHOW_MODAL } from "../actions/constants";
import * as modalActions from "../actions/modalActions";
import { IModal } from "../entities/IModal";
import { initialStoreState } from "../store/initialStoreState";

type actions =
  | ActionType<typeof modalActions.showModal>
  | ActionType<typeof modalActions.hideModal>;

export const modalReducer: Reducer<IModal | null, actions> = (
  state = initialStoreState.modal,
  action
) => {
  switch (action.type) {
    case SHOW_MODAL:
      return action.payload.modal;
    case HIDE_MODAL:
      return initialStoreState.modal;
    default:
      return state;
  }
};
