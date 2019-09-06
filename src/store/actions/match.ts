import fetch from 'cross-fetch';
import {ThunkAction, ThunkDispatch} from "redux-thunk";

export const REQUEST_UPDATE = 'REQUEST_UPDATE';
export const RECEIVED_UPDATE = 'RECEIVED_UPDATE';
export const FAILED_UPDATE = 'FAILED_UPDATE';

export type MatchState = {
    matchId: String,
    fetching?: boolean,
    matchData?: any,
};

interface IRequestAction {
    type: 'REQUEST_UPDATE',
    matchId: String
}

interface IReceivedAction {
    type: 'RECEIVED_UPDATE',
    matchId: String,
    matchData: any
}

interface IFailedAction {
    type: 'FAILED_UPDATE',
    matchId: String,
    error: any
}

export type MatchActions = IRequestAction | IReceivedAction | IFailedAction;

const requestUpdate = (matchId): IRequestAction => {
    return {
        type: REQUEST_UPDATE,
        matchId
    };
};

const receivedUpdate = (matchId, json): IReceivedAction => {
    return {
        type: RECEIVED_UPDATE,
        matchId,
        matchData: json
    };
};

const failedUpdate = (matchId, error): IFailedAction => {
    return {
        type: FAILED_UPDATE,
        matchId,
        error
    };
};

export const fetchUpdate = (matchId: String): ThunkAction<Promise<any>, MatchState, null, null> => {
    return async (dispatch: ThunkDispatch<MatchState, undefined, any>) => {
        dispatch(requestUpdate(matchId));

        return fetch('https://api.guildwars2.com/v2/wvw/matches/' + matchId)
            .then(response => response.json(), error => dispatch(failedUpdate(matchId, error)))
            .then(json => dispatch(receivedUpdate(matchId, json)));
    };
};
