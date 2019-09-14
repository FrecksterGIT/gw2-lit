import {css, customElement, html, property} from 'lit-element';
import {BaseElement} from './base';

@customElement('gw2-guild-upgrades')
export class GuildUpgrades extends BaseElement {

    @property() private upgrades;
    @property() private upgradesData;

    static get styles() {
        return [
            css`:host .upgrades {
                display: flex;
                flex-flow: row wrap;
                justify-content: space-between;
            }`,
            css`:host .upgrade {
                min-width: 64px;
                margin-bottom: 6px;
                overflow: hidden;
                text-align: center;
                width: calc(33% - 10px);
            }`
        ];
    }

    public stateChanged(state) {
        super.stateChanged(state);

        if (state.resources.UPGRADES) {
            this.upgradesData = this.upgrades.map((upgrade) => state.resources.UPGRADES[upgrade]);
        }
    }

    protected render() {
        return html`<div class="upgrades">${this.upgradesData.map((upgrade) => this.renderUpgrade(upgrade))}</div>`;
    }

    private renderUpgrade(upgrade) {
        return html`<div class="upgrade">
            <img src="${upgrade.icon}" alt=""/><br />
            ${upgrade.name}
         </div>`;
    }
}
