import throttle from 'lodash.throttle';
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

export type Actions = MatchActions & ResourcesActions & ILoggerAction & II18NAction;
export type State = IMatchState & IResourcesState & ILoggerState & II18NState;

// @ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const loadState = () => {
    try {
        const serializedState = localStorage.getItem('state');
        if (serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState);
    } catch (err) {
        return undefined;
    }
};

export const saveState = (state) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('state', serializedState);
    } catch {
        // ignore write errors
    }
};

export const store = createStore(
    combineReducers({
        i18n,
        logger,
        match,
        resources
    }),
    loadState(),
    composeEnhancers(
        applyMiddleware(thunk as ThunkMiddleware<State, Actions>)
    )
);

store.subscribe(throttle(() => {
    saveState({
        resources: store.getState().resources
    });
}, 1000));
