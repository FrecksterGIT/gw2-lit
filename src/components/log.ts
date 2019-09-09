import {css, customElement, html, property} from 'lit-element';
import {CLAIM, OWNER} from '../store/actions/logger';

import {BaseElement} from './base';

import './guild-name';

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
            }`,
            css`:host .red {
                color: #b02822;
            }`,
            css`:host .blue {
                color: #1a4da1;
            }`,
            css`:host .green {
                color: #1e7b2d;
            }`
        ];
    }

    public stateChanged(state) {
        super.stateChanged(state);
        if (state.logger.messages) {
            this.messages = state.logger.messages.slice(0, 80);
        }
    }

    protected render() {
        return html`${this.messages.map((message) => this.renderMessage(message))}`;
    }

    private renderMessage(message) {
        switch (message.type) {
            case OWNER:
                return html`<p>${this.formatDateRelativeToNow(message.time)}:
                    ${message.objectiveName} ${message.oldValue} ${this.t('captured by')} <span class="${message.newValue.toLowerCase()}">${message.newValue}</span></p>`;
            case CLAIM:
                return html`<p>${this.formatDateRelativeToNow(message.time)}:
                    ${message.objectiveName} ${message.oldValue} ${this.t('claimed by')} <gw2-guild-name .guildId=${message.newValue} .color=${message.owner}></gw2-guild-name></p>`;
        }
    }
}
