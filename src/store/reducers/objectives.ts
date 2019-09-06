import {FAILED, RECEIVED, REQUEST} from "../actions/objectives";

const INITIAL_STATE = {
    fetching: false,
    data: []
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
                fetching: false,
                data: action.data.reduce((obj, item) => {
                    obj[item.id] = item;
                    return obj;
                }, {})
            };
        case FAILED:
            return {
                ...state,
                fetching: false,
                error: action.error
            };
        default:
            return state;
    }
};
