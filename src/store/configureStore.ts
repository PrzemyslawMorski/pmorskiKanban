import { applyMiddleware, createStore, Store } from "redux";
import { createEpicMiddleware } from "redux-observable";
import { rootEpic } from "../epics/rootEpic";
import { rootReducer } from "../reducers/rootReducer";
import { initialStoreState } from "./initialStoreState";

const epicMiddleware = createEpicMiddleware();

export function configureStore(): Store {
    const store = createStore(rootReducer, initialStoreState, applyMiddleware(epicMiddleware));
    epicMiddleware.run(rootEpic);
    return store;
}
