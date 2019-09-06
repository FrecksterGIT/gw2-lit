import {applyMiddleware, combineReducers, compose, createStore} from "redux";
import thunk, {ThunkMiddleware} from "redux-thunk";

import {MatchActions, MatchState} from "./actions/match";
import {ObjectiveActions, ObjectiveState} from "./actions/objectives";

import match from "./reducers/match";
import objectives from "./reducers/objectives";

type Actions = MatchActions & ObjectiveActions;
type State = MatchState & ObjectiveState;

// @ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(
    combineReducers({
        match,
        objectives
    }),
    composeEnhancers(
        applyMiddleware(thunk as ThunkMiddleware<State, Actions>)
    )
);
