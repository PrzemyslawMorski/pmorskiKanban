import {action} from "typesafe-actions";
import {IBoardMiniature} from "../entities/IBoard";
import * as actionTypes from "./constants";

export const boardMiniatures = (boards: IBoardMiniature[]) => action(actionTypes.BOARD_MINIATURES, boards);
