import Cookies from 'js-cookie';
import {css, customElement, html, property} from 'lit-element';

import {BaseElement} from './components/base';

import {changeLanguage} from './store/actions/i18n';
import {changeMatch, fetchUpdate} from './store/actions/match';
import {fetchMatches, fetchObjectives, fetchUpgrades, fetchWorlds} from './store/actions/resources';
import {store} from './store/store';

import './components/log';
import './components/match-overview';
import './components/match-selector';
import './components/world';

@customElement('gw2-wvw')
class WvW extends BaseElement {

    @property({type: String}) private matchId: string = '';

    private matchUpdateInterval;

    public static get styles() {
        return [
            css`:host {
                display: block;
                margin: 0 auto;
                max-width: 1080px;
                min-width: 810px;
            }`,
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

    public stateChanged(state) {
        super.stateChanged(state);
        if (state.match.matchId) {
            this.matchId = state.match.matchId;
        }
    }

    protected firstUpdated(changedProperties: Map<PropertyKey, unknown>): void {
        const lng = Cookies.get('lng') ? Cookies.get('lng') : 'en';
        const matchId = Cookies.get('match') ? Cookies.get('match') : '2-1';

        if (lng) {
            store.dispatch(changeLanguage(lng));
        }

        if (matchId) {
            store.dispatch(changeMatch(matchId));
        }
    }

    protected updated(changedProperties: Map<PropertyKey, unknown>): void {
        super.updated(changedProperties);
        if (changedProperties.has('lng')) {
            store.dispatch<any>(fetchObjectives(this.lng));
            store.dispatch<any>(fetchWorlds(this.lng));
            store.dispatch<any>(fetchUpgrades(this.lng));

            Cookies.set('lng', this.lng);
        }
        if (changedProperties.has('matchId')) {
            if (this.matchUpdateInterval) {
                window.clearInterval(this.matchUpdateInterval);
            }

            store.dispatch<any>(fetchUpdate(this.matchId));

            this.matchUpdateInterval = setInterval(() => {
                store.dispatch<any>(fetchUpdate(this.matchId));
            }, 5000);

            Cookies.set('match', this.matchId);
        }
    }

    protected render() {
        const output = this.matchId ? html`<gw2-world></gw2-world>
            <div class="infos">    
                <gw2-match-selector></gw2-match-selector>
                <gw2-match-overview></gw2-match-overview>
                <gw2-log></gw2-log>
            </div>` : html``;

        return html`
            <button @click=${() => store.dispatch(changeLanguage('de'))}>de</button>
            <button @click=${() => store.dispatch(changeLanguage('en'))}>en</button>
            <button @click=${() => store.dispatch(changeLanguage('es'))}>es</button>
            <button @click=${() => store.dispatch(changeLanguage('fr'))}>fr</button>
            ${output}            
        `;
    }
}
