import {customElement, html} from 'lit-element';

import {BaseElement} from './components/base';

import {changeLanguage} from './store/actions/i18n';
import {store} from './store/store';

import './components/log';
import './components/world';

@customElement('gw2-wvw')
class WvW extends BaseElement {

    protected render() {
        return html`
            <button @click=${() => store.dispatch(changeLanguage('de'))}>de</button>
            <button @click=${() => store.dispatch(changeLanguage('en'))}>en</button>
            <button @click=${() => store.dispatch(changeLanguage('es'))}>es</button>
            <button @click=${() => store.dispatch(changeLanguage('fr'))}>fr</button>
            <gw2-world></gw2-world><gw2-log></gw2-log>
        `;
    }
}
