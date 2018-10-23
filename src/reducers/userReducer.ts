import {Reducer} from "redux";
import {ActionType} from "typesafe-actions";
import {NEW_USER_NAME, USER_DATA} from "../actions/constants";
import * as actions from "../actions/userActions";
import {IUser} from "../entities/IUser";
import {initialStoreState} from "../store/initialStoreState";

type userActions = ActionType<typeof actions>;

export const userReducer: Reducer<IUser | null, userActions> = (
  state: IUser | null = initialStoreState.user,
  action: userActions,
) => {
  switch (action.type) {
    case USER_DATA:
      return action.payload;
    case NEW_USER_NAME:
      return {
        displayName: action.payload,
        email: state!.email,
        photoURL: state!.photoURL,
        uid: state!.uid,
      };
    default:
      return state;
  }
};
