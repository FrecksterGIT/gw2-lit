import {FAILED, RECEIVED, REQUEST} from '../actions/objectives';

const INITIAL_STATE = {
    data: [],
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
            return {
                ...state,
                data: action.data.reduce((obj, item) => {
                    obj[item.id] = item;
                    return obj;
                }, {}),
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
