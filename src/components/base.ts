import {isToday} from 'date-fns';
import i18n from 'i18next';
import {html, LitElement, property} from 'lit-element';
import {unsafeHTML} from 'lit-html/directives/unsafe-html';
import {connect} from 'pwa-helpers/connect-mixin';

import de from '../locales/de.json';
import en from '../locales/en.json';
import es from '../locales/es.json';
import fr from '../locales/fr.json';
import {store} from '../store/store';

export class BaseElement extends connect(store)(LitElement) {

    @property({type: String}) protected lng: string = 'en';

    constructor() {
        super();
        this.initI18N();
    }

    public stateChanged(state) {
        this.lng = state.i18n.lng;
    }

    protected updated(changedProperties: Map<PropertyKey, unknown>): void {
        if (changedProperties.has('lng')) {
            i18n.changeLanguage(this.lng).then(() => this.requestUpdate());
        }
    }

    protected t(key, options?) {
        return html`${unsafeHTML(i18n.t(key, options))}`;
    }

    protected formatDateRelativeToNow(date) {
        return !isToday(date) ? date.toLocaleString() : date.toLocaleTimeString();
    }

    private initI18N() {
        if (!i18n.isInitialized) {
            const lng = store.getState().i18n.lng;
            i18n.init({
                lng,
                resources: {
                    de: {
                        translation: de
                    },
                    en: {
                        translation: en
                    },
                    es: {
                        translation: es
                    },
                    fr: {
                        translation: fr
                    }
                }
            }).then(() => {
                // tslint:disable-next-line
                console.log('i18n initialized');
            });
        }
    }
}
