export const OWNER = 'OWNER';
export const CLAIM = 'CLAIM';

export interface ILoggerState {
    messages: string[];
}

type LogType = 'OWNER' | 'CLAIM';

export interface ILoggerAction {
    newValue: string;
    objective: any;
    oldValue: string;
    time: string;
    type: LogType;
}

export const logChange = (
    type: LogType,
    objective: any,
    oldValue: string,
    newValue: string,
    time: string): ILoggerAction => {
    return {
        newValue,
        objective,
        oldValue,
        time,
        type
    };
};
