import {FAILED_UPDATE, MATCH_ID, RECEIVED_UPDATE, REQUEST_UPDATE} from '../actions/match';

const INITIAL_STATE = {
    fetching: false
};

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
                error: action.error,
                fetching: false
            };
        case MATCH_ID: {
            return {
                ...INITIAL_STATE,
                matchId: action.matchId
            };
        }
        default:
            return state;
    }
};
