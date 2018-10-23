import {IBoardMiniature} from "../entities/IBoard";
import {IUser} from "../entities/IUser";

export interface IState {
  readonly user: IUser | null;
  readonly boards: IBoardMiniature[];
}
