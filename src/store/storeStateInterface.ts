import {IUser} from "../entities/User";

export interface IState {
  readonly appName: string;
  readonly user: IUser;
}
