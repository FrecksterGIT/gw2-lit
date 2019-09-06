import fetch from 'cross-fetch';
import {ThunkAction, ThunkDispatch} from "redux-thunk";

export const REQUEST = 'REQUEST';
export const RECEIVED = 'RECEIVED';
export const FAILED = 'FAILED';

export type ObjectiveState = {
    fetching?: boolean,
    data?: any,
};

interface IRequestAction {
    type: 'REQUEST'
}

interface IReceivedAction {
    type: 'RECEIVED',
    data: any
}

interface IFailedAction {
    type: 'FAILED',
    error: any
}

export type ObjectiveActions = IRequestAction | IReceivedAction | IFailedAction;

const request = (): IRequestAction => {
    return {
        type: REQUEST
    };
};

const received = (json): IReceivedAction => {
    return {
        type: RECEIVED,
        data: json
    };
};

const failed = (error): IFailedAction => {
    return {
        type: FAILED,
        error
    };
};

export const fetchObjectives = (): ThunkAction<Promise<any>, ObjectiveState, null, null> => {
    return async (dispatch: ThunkDispatch<ObjectiveState, undefined, any>) => {
        dispatch(request());

        return fetch('https://api.guildwars2.com/v2/wvw/objectives?ids=all')
            .then(response => response.json(), error => dispatch(failed(error)))
            .then(json => dispatch(received(json)));
    };
};
