import { action } from "typesafe-actions";
import * as actionTypes from "./constants";
import { IAlert } from "../entities/IAlert";

export const showAlert = (alert: IAlert) =>
  action(actionTypes.SHOW_ALERT, alert);

export const hideAlert = () => action(actionTypes.HIDE_ALERT);
