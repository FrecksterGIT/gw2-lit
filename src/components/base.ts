import {isToday} from 'date-fns';
import {html, LitElement, property} from 'lit-element';
import {connect} from 'pwa-helpers/connect-mixin';

import {store} from '../store/store';

import de from '../locales/de.json';
import en from '../locales/en.json';
import es from '../locales/es.json';
import fr from '../locales/fr.json';

export class BaseElement extends connect(store)(LitElement) {

    @property({type: String}) protected lng: string = 'en';
    private readonly languages;

    constructor() {
        super();
        this.languages = {de, en, es, fr};
    }

    public stateChanged(state) {
        this.lng = state.i18n.lng;
    }

    protected updated(changedProperties: Map<PropertyKey, unknown>): void {
        if (changedProperties.has('lng')) {
            this.requestUpdate().then(() => {
                // noop
            });
        }
    }

    protected t(key) {
        return html`${this.languages[this.lng][key]}`;
    }

    protected formatDateByToday(date) {
        return !isToday(date) ? date.toLocaleString() : date.toLocaleTimeString();
    }
}
