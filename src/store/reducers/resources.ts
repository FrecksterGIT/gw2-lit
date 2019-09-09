import {FAILED, RECEIVED, REQUEST} from '../actions/resources';

const INITIAL_STATE = {
    OBJECTIVES: [],
    WORLDS: [],
    fetching: false
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case REQUEST:
            return {
                ...state,
                fetching: true
            };
        case RECEIVED:
            const receivedData = action.data.reduce((obj, item) => {
                obj[item.id] = item;
                return obj;
            }, {});
            state[action.dataType] = receivedData;
            return {
                ...state,
                fetching: false
            };
        case FAILED:
            return {
                ...state,
                error: action.error,
                fetching: false
            };
        default:
            return state;
    }
};
