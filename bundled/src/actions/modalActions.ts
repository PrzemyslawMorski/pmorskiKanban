import {action} from "typesafe-actions";
import {IModal} from "../entities/IModal";
import * as actionTypes from "./constants";

export const showModal = (modal: IModal) =>
  action(actionTypes.SHOW_MODAL, {modal});

export const hideModal = () => action(actionTypes.HIDE_MODAL);
