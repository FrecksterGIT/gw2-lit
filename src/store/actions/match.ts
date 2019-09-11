import fetch from 'cross-fetch';
import {ThunkAction, ThunkDispatch} from 'redux-thunk';

export const REQUEST_UPDATE = 'REQUEST_UPDATE';
export const RECEIVED_UPDATE = 'RECEIVED_UPDATE';
export const FAILED_UPDATE = 'FAILED_UPDATE';
export const MATCH_ID = 'MATCH_ID';

export interface IMatchState {
    fetching?: boolean;
    matchData?: any;
    matchId: string;
}

interface IRequestAction {
    matchId: string;
    type: 'REQUEST_UPDATE';
}

interface IReceivedAction {
    matchData: any;
    matchId: string;
    type: 'RECEIVED_UPDATE';
}

interface IFailedAction {
    error: any;
    matchId: string;
    type: 'FAILED_UPDATE';
}

export type MatchActions = IRequestAction | IReceivedAction | IFailedAction;

const requestUpdate = (matchId): IRequestAction => {
    return {
        matchId,
        type: REQUEST_UPDATE
    };
};

const receivedUpdate = (matchId: string, json: any): IReceivedAction => {
    return {
        matchData: json,
        matchId,
        type: RECEIVED_UPDATE
    };
};

const failedUpdate = (matchId: string, error: any): IFailedAction => {
    return {
        error,
        matchId,
        type: FAILED_UPDATE
    };
};

export const changeMatch = (matchId) => {
    return {
        matchId,
        type: MATCH_ID
    };
};

export const fetchUpdate = (matchId: string): ThunkAction<Promise<any>, IMatchState, null, null> => {
    return async (dispatch: ThunkDispatch<IMatchState, undefined, any>) => {
        dispatch(requestUpdate(matchId));

        return fetch('https://api.guildwars2.com/v2/wvw/matches/' + matchId)
            .then((response) => response.json(), (error) => dispatch(failedUpdate(matchId, error)))
            .then((json) => dispatch(receivedUpdate(matchId, json)));
    };
};
