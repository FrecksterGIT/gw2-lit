import fetch from 'cross-fetch';
import {ThunkAction, ThunkDispatch} from 'redux-thunk';

export const REQUEST = 'REQUEST';
export const RECEIVED = 'RECEIVED';
export const FAILED = 'FAILED';

export interface IObjectiveState {
    data?: any;
    fetching?: boolean;
}

interface IRequestAction {
    type: 'REQUEST';
}

interface IReceivedAction {
    data: any;
    type: 'RECEIVED';
}

interface IFailedAction {
    error: any;
    type: 'FAILED';
}

export type ObjectiveActions = IRequestAction | IReceivedAction | IFailedAction;

const request = (): IRequestAction => {
    return {
        type: REQUEST
    };
};

const received = (json): IReceivedAction => {
    return {
        data: json,
        type: RECEIVED
    };
};

const failed = (error): IFailedAction => {
    return {
        error,
        type: FAILED
    };
};

export const fetchObjectives = (): ThunkAction<Promise<any>, IObjectiveState, null, null> => {
    return async (dispatch: ThunkDispatch<IObjectiveState, undefined, any>) => {
        dispatch(request());

        return fetch('https://api.guildwars2.com/v2/wvw/objectives?ids=all')
            .then((response) => response.json(), (error) => dispatch(failed(error)))
            .then((json) => dispatch(received(json)));
    };
};
