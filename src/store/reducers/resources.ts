import {FAILED, RECEIVED, REQUEST} from '../actions/resources';

const INITIAL_STATE = {
    GUILDS: [],
    MATCHES: [],
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
            if (Array.isArray(action.data)) {
                state[action.dataType] = action.data.reduce((obj, item) => {
                    obj[item.id] = item;
                    return obj;
                }, {});
            } else if (action.data && action.data.id) {
                state[action.dataType][action.data.id] = action.data;
                state[action.dataType] = Object.assign({}, state[action.dataType]);
            }
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
