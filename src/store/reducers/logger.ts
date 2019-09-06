import {CLAIM, OWNER} from '../actions/logger';

interface IMessage {
    action: 'OWNER' | 'CLAIM';
    newValue: any;
    objectiveId: string;
    objectiveName: string;
    oldValue: any;
    time: Date;
}

const INITIAL_STATE = {
    messages: Array<IMessage> ()
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case OWNER:
        case CLAIM:
            const messages = state.messages;
            messages.push({
                action: action.type,
                newValue: action.newValue,
                objectiveId: action.objective.id,
                objectiveName: action.objective.name,
                oldValue: action.oldValue,
                time: new Date(action.time)
            });
            messages.sort((a, b) => a.time < b.time ? 1 : -1);
            return {
                ...state,
                messages
            };
        default:
            return state;
    }
};
