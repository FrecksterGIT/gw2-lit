import {LANG} from '../actions/i18n';

const INITIAL_STATE = {
    lng: 'en'
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case LANG:
            return {
                ...state,
                lng: action.lng
            };
        default:
            return state;
    }
};
