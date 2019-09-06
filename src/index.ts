import {customElement, html, LitElement} from 'lit-element';

import './components/log';
import './components/world';

@customElement('gw2-wvw')
class WvW extends LitElement {
    protected render() {
        return html`<gw2-world></gw2-world><gw2-log></gw2-log>`;
    }
}
