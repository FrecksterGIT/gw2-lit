import {css, customElement, html, property} from 'lit-element';

import {BaseElement} from '../base';

@customElement('gw2-log')
export class Gw2Info extends BaseElement {
    @property() private messages;

    public static get styles() {
        return [
            css`:host {
                color: #e1e1e1;
                display: block;
                font: 11px/13px 'Open Sans', sans-serif, arial;
                height: 120px;
                overflow-y: scroll;
            }`
        ];
    }

    public stateChanged(state) {
        super.stateChanged(state);
        if (state.logger.messages) {
            this.messages = state.logger.messages.slice(0, 20);
        }
    }

    protected render() {
        return html`${this.messages.map((message) => this.renderMessage(message))}`;
    }

    private renderMessage(message) {
        return html`<p>${message.time.toLocaleTimeString()}: ${message.objectiveName}: ${message.oldValue} -> ${message.newValue}</p>`;
    }
}
