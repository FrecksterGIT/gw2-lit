export const LANG = 'LANG';

export interface II18NState {
    lng: string;
}

export interface II18NAction {
    lng: string;
    type: 'LANG';
}

export const changeLanguage = (language: string) => {
    return {
        lng: language,
        type: LANG
    };
};
