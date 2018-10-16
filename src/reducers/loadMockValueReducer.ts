import * as actions from "../actions/mockValueActions";

import { Reducer } from "redux";
import { ActionType } from "typesafe-actions";
import { MOCK_VALUE_LOADED } from "../actions/constants";
import { initialStoreState } from "../store/initialStoreState";

type mockValueAction = ActionType<typeof actions>;

export const mockValueReducer: Reducer<string, mockValueAction> = (
    state: string = initialStoreState.appName,
    action: mockValueAction,
) => {
    switch (action.type) {
        case MOCK_VALUE_LOADED:
            return action.payload;
        default:
            return state;
    }
};
