import * as firebase from "firebase";

export interface IState {
  readonly appName: string;
  readonly user: firebase.User | null;
}
