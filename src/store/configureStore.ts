import {Action, applyMiddleware, createStore, Store} from "redux";
import { createEpicMiddleware } from "redux-observable";
import { rootEpic } from "../epics/rootEpic";
import { rootReducer } from "../reducers/rootReducer";
import { initialStoreState } from "./initialStoreState";
import {IState} from "./storeStateInterface";

const epicMiddleware = createEpicMiddleware<Action, Action, IState>();

export function configureStore(): Store {
    const store = createStore(rootReducer, initialStoreState, applyMiddleware(epicMiddleware));
    epicMiddleware.run(rootEpic);
    return store;
}
