import {applyMiddleware, combineReducers, compose, createStore} from 'redux';
import thunk, {ThunkMiddleware} from 'redux-thunk';
import {II18NAction, II18NState} from './actions/i18n';

import {ILoggerAction, ILoggerState} from './actions/logger';
import {IMatchState, MatchActions} from './actions/match';
import {IResourcesState, ResourcesActions} from './actions/resources';

import i18n from './reducers/i18n';
import logger from './reducers/logger';
import match from './reducers/match';
import resources from './reducers/resources';

type Actions = MatchActions & ResourcesActions & ILoggerAction & II18NAction;
type State = IMatchState & IResourcesState & ILoggerState & II18NState;

// @ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(
    combineReducers({
        i18n,
        logger,
        match,
        resources
    }),
    composeEnhancers(
        applyMiddleware(thunk as ThunkMiddleware<State, Actions>)
    )
);
