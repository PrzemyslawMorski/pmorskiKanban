import {action} from "typesafe-actions";
import * as actionTypes from "./constants";

export const loadMockValue = () => action(actionTypes.LOAD_MOCK_VALUE);
export const mockValueLoaded = (value: string) => action(actionTypes.MOCK_VALUE_LOADED, value);
