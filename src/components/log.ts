import {css, customElement, html, property} from 'lit-element';
import {CLAIM, OWNER} from '../store/actions/logger';

import {BaseElement} from './base';

import './guild-name';

@customElement('gw2-log')
export class Gw2Info extends BaseElement {

    @property() private messages;
    @property() private worlds = {};
    @property() private worldData = {};

    public static get styles() {
        return [
            css`:host {
                color: #e1e1e1;
                display: block;
                flex: 0 0 auto;
                font: 11px/13px 'Open Sans', sans-serif, arial;
                height: 120px;
                overflow-y: scroll;
                width: calc(50% - 8px);
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

        if (state.match.matchData) {
            this.worlds = state.match.matchData.worlds;
        }

        if (state.resources.WORLDS) {
            this.worldData = state.resources.WORLDS;
        }
    }

    protected render() {
        return html`${this.messages.map((message) => this.renderMessage(message))}`;
    }

    private renderMessage(message) {
        switch (message.type) {
            case OWNER:
                const newOwner = html`<span class="${message.newValue.toLowerCase()}">${this.getWorldName(message.newValue.toLowerCase())}</span>`;
                const oldOwner = (message.oldValue)
                    ? html` ${this.t('from')} <span class="${message.oldValue.toLowerCase()}">${this.getWorldName(message.oldValue.toLowerCase())}</span>`
                    : html ``;

                return html`<p>${this.formatDateRelativeToNow(message.time)}:
                    <span class="${message.newValue.toLowerCase()}">${message.objectiveName}</span> ${message.oldValue} ${this.t('captured by')} ${newOwner}${oldOwner}</p>`;
            case CLAIM:
                return html`<p>${this.formatDateRelativeToNow(message.time)}:
                    <span class="${message.owner.toLowerCase()}">${message.objectiveName}</span> ${this.t('claimed by')} <gw2-guild-name .guildId=${message.newValue} .color=${message.owner}></gw2-guild-name></p>`;
        }
    }

    private getWorldName(color) {
        return this.worldData[this.worlds[color]] ? this.worldData[this.worlds[color]].name : color;
    }
}
