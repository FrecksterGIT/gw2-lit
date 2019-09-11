export const OWNER = 'OWNER';
export const CLAIM = 'CLAIM';
export const CLEAR = 'CLEAR';

export interface ILoggerState {
    messages: string[];
}

type LogType = 'OWNER' | 'CLAIM' | 'CLEAR';

export interface ILoggerAction {
    newValue?: string;
    objective?: any;
    oldValue?: string;
    owner?: string;
    time?: string;
    type: LogType;
}

export const clearLog = (): ILoggerAction => {
    return {
        type: CLEAR
    };
};

export const logChange = (
    type: LogType,
    objective: any,
    owner: string,
    oldValue: string,
    newValue: string,
    time: string): ILoggerAction => {
    return {
        newValue,
        objective,
        oldValue,
        owner,
        time,
        type
    };
};
