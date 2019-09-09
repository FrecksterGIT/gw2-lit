import fetch from 'cross-fetch';
import {ThunkAction, ThunkDispatch} from 'redux-thunk';

export const REQUEST = 'REQUEST';
export const RECEIVED = 'RECEIVED';
export const FAILED = 'FAILED';

type DataType = 'MATCHES' | 'OBJECTIVES' | 'WORLDS';

export interface IResourcesState {
    data?: any;
    fetching?: boolean;
}

interface IRequestAction {
    dataType: DataType;
    type: 'REQUEST';
}

interface IReceivedAction {
    data: any;
    dataType: DataType;
    type: 'RECEIVED';
}

interface IFailedAction {
    error: any;
    dataType: DataType;
    type: 'FAILED';
}

export type ResourcesActions = IRequestAction | IReceivedAction | IFailedAction;

const request = (dataType: DataType): IRequestAction => {
    return {
        dataType,
        type: REQUEST
    };
};

const received = (json, dataType: DataType): IReceivedAction => {
    return {
        data: json,
        dataType,
        type: RECEIVED
    };
};

const failed = (error, dataType: DataType): IFailedAction => {
    return {
        dataType,
        error,
        type: FAILED
    };
};

const fetchData = (url, dataType: DataType)  => {
    return async (dispatch: ThunkDispatch<IResourcesState, undefined, any>) => {
        dispatch(request(dataType));

        return fetch(url)
            .then((response) => response.json(), (error) => dispatch(failed(error, dataType)))
            .then((json) => dispatch(received(json, dataType)));
    };
};

export const fetchObjectives = (): ThunkAction<Promise<any>, IResourcesState, null, null> => {
    return fetchData('https://api.guildwars2.com/v2/wvw/objectives?ids=all', 'OBJECTIVES');
};

export const fetchWorlds = (): ThunkAction<Promise<any>, IResourcesState, null, null> => {
    return fetchData('https://api.guildwars2.com/v2/worlds?ids=all', 'WORLDS');
};

export const fetchMatches = (): ThunkAction<Promise<any>, IResourcesState, null, null> => {
    return fetchData('https://api.guildwars2.com/v2/wvw/matches/overview?ids=all', 'MATCHES');
};
