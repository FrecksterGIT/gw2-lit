import {applyMiddleware, combineReducers, compose, createStore} from 'redux';
import thunk, {ThunkMiddleware} from 'redux-thunk';

import {ILoggerAction, ILoggerState} from './actions/logger';
import {IMatchState, MatchActions} from './actions/match';
import {IObjectiveState, ObjectiveActions} from './actions/objectives';

import logger from './reducers/logger';
import match from './reducers/match';
import objectives from './reducers/objectives';

type Actions = MatchActions & ObjectiveActions & ILoggerAction;
type State = IMatchState & IObjectiveState & ILoggerState;

// @ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(
    combineReducers({
        logger,
        match,
        objectives
    }),
    composeEnhancers(
        applyMiddleware(thunk as ThunkMiddleware<State, Actions>)
    )
);
