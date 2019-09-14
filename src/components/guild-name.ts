import {css, customElement, html, property} from 'lit-element';

import {fetchGuild} from '../store/actions/resources';
import {store} from '../store/store';

import {BaseElement} from './base';

@customElement('gw2-guild-name')
export class GuildName extends BaseElement {

    @property({type: String}) private guildId: string = '';
    @property({type: Object}) private guildData: any = {};
    @property({type: String}) private color: string = '';

    public static get styles() {
        return [
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

        if (state.resources.GUILDS && state.resources.GUILDS[this.guildId]) {
            this.guildData = state.resources.GUILDS[this.guildId];
        }
    }

    protected updated(changedProperties: Map<PropertyKey, unknown>): void {
        super.updated(changedProperties);
        if (changedProperties.has('guildId')) {
            store.dispatch<any>(fetchGuild(this.guildId));
        }
    }

    protected render() {
        const colorClass = this.color ? this.color.toLowerCase() : '';
        const guildName = (this.guildData && this.guildData.name) ? this.guildData.name + ' [' + this.guildData.tag + ']' : this.guildId;

        return html`<span class="${colorClass}">${guildName}</span>`;
    }
}
