import {IUser} from "../entities/IUser";

export interface IState {
  readonly appName: string;
  readonly user: IUser | null;
}
