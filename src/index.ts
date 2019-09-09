import {css, customElement, html} from 'lit-element';

import {BaseElement} from './components/base';

import {changeLanguage} from './store/actions/i18n';
import {fetchMatches, fetchObjectives, fetchWorlds} from './store/actions/resources';
import {store} from './store/store';

import './components/log';
import './components/match-overview';
import './components/world';

@customElement('gw2-wvw')
class WvW extends BaseElement {

    public static get styles() {
        return [
            css`:host .infos {
                align-content: space-between;
                display: flex;
                flex-flow: row nowrap;
                width: 100%;
            }`
        ];
    }

    constructor() {
        super();
        store.dispatch<any>(fetchObjectives());
        store.dispatch<any>(fetchWorlds());
        store.dispatch<any>(fetchMatches());
    }

    protected updated(changedProperties: Map<PropertyKey, unknown>): void {
        if (changedProperties.has('lng')) {
            store.dispatch<any>(fetchObjectives(this.lng));
            store.dispatch<any>(fetchWorlds(this.lng));
        }
    }

    protected render() {
        return html`
            <button @click=${() => store.dispatch(changeLanguage('de'))}>de</button>
            <button @click=${() => store.dispatch(changeLanguage('en'))}>en</button>
            <button @click=${() => store.dispatch(changeLanguage('es'))}>es</button>
            <button @click=${() => store.dispatch(changeLanguage('fr'))}>fr</button>
            <gw2-world></gw2-world>
            <div class="infos">
                <gw2-match-overview></gw2-match-overview>
                <gw2-log></gw2-log>
            </div>
        `;
    }
}
