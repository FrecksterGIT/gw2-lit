import {applyMiddleware, combineReducers, compose, createStore} from 'redux';
import thunk, {ThunkMiddleware} from 'redux-thunk';
import {II18NAction, II18NState} from './actions/i18n';

import {ILoggerAction, ILoggerState} from './actions/logger';
import {IMatchState, MatchActions} from './actions/match';
import {IObjectiveState, ObjectiveActions} from './actions/objectives';

import i18n from './reducers/i18n';
import logger from './reducers/logger';
import match from './reducers/match';
import objectives from './reducers/objectives';

type Actions = MatchActions & ObjectiveActions & ILoggerAction & II18NAction;
type State = IMatchState & IObjectiveState & ILoggerState & II18NState;

// @ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(
    combineReducers({
        i18n,
        logger,
        match,
        objectives
    }),
    composeEnhancers(
        applyMiddleware(thunk as ThunkMiddleware<State, Actions>)
    )
);
