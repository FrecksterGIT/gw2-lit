import {FAILED_UPDATE, RECEIVED_UPDATE, REQUEST_UPDATE} from "../actions/match";

const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case REQUEST_UPDATE:
            return {
                ...state,
                fetching: true
            };
        case RECEIVED_UPDATE:
            return {
                ...state,
                fetching: false,
                matchData: action.matchData
            };
        case FAILED_UPDATE:
            return {
                ...state,
                fetching: false,
                error: action.error
            };
        default:
            return state;
    }
};
