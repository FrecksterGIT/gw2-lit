import {css, customElement, html, LitElement, property} from 'lit-element';
import {connect} from 'pwa-helpers/connect-mixin';

import {CLAIM, logChange} from '../store/actions/logger';
import {store} from '../store/store';

@customElement('gw2-info')
export class Gw2Info extends connect(store)(LitElement) {

    static get styles() {
        return [
            css`:host {
                background: rgba(0, 0, 0, .8);
                border: 1px solid #000;
                border-radius: 4px;
                color: #e1e1e1;
                font: 11px/13px 'Open Sans', sans-serif, arial;
                left: 40px;
                padding: 6px 11px;
                position: relative;
                top: 0;
                width: 170px;
            }`
        ];
    }

    @property() public objectiveId;
    @property() public objectiveData;

    @property({type: String}) public lastFlipped: string;
    @property({type: String}) public claimedBy: string;
    @property({type: String}) public claimedAt: string;
    @property({type: Number}) public pointsTick: number;
    @property({type: Number}) public pointsCapture: number;
    @property({type: Number}) public yaksDelivered: number;
    @property({type: Array}) public guildUpgrades: number[] = [];

    public stateChanged(state) {
        if (state.match.matchData) {
            const objective = this.getObjective(state);

            this.lastFlipped = objective.last_flipped;
            this.claimedBy = objective.claimed_by;
            this.claimedAt = objective.claimed_at;
            this.pointsTick = objective.points_tick;
            this.pointsCapture = objective.points_capture;
            this.yaksDelivered = objective.yaks_delivered;
            this.updateGuildUpgrades(objective.guild_upgrades);
        }
        if (state.objectives.data && state.objectives.data[this.objectiveId]) {
            this.objectiveData = state.objectives.data[this.objectiveId];
        }
    }

    public getObjective(state) {
        return state.match.matchData.maps.reduce((objective, map) => {
            if (objective) {
                return objective;
            }
            return map.objectives.reduce((found, obj) => {
                return obj.id === this.objectiveId ? obj : found;
            }, null);
        }, null);
    }

    public renderDataEntries() {
        return [
            html`<dt>Turned</dt><dd>${this.lastFlipped}</dd>`,
            html`<dt>Guild</dt><dd>${this.claimedBy}</dd>`,
            html`<dt>Claimed</dt><dd>${this.claimedAt}</dd>`,
            html`<dt>Dolyaks</dt><dd>${this.yaksDelivered}</dd>`
        ];
    }

    public render() {
        return html`<b>${this.objectiveData.name}</b>
        <dl>${this.renderDataEntries()}</dl>`;
    }

    protected updated(changedProperties: Map<PropertyKey, unknown>): void {
        if (changedProperties.has('claimedBy') && this.claimedBy) {
            store.dispatch(
                logChange(
                    CLAIM,
                    this.objectiveData,
                    changedProperties.get('claimedBy') as string,
                    this.claimedBy, this.claimedAt
                ));
        }
    }

    private updateGuildUpgrades(objUpgrades) {
        if (!objUpgrades && this.guildUpgrades) {
            this.guildUpgrades = [];
        }
        objUpgrades.forEach((objUpgrade) => {
            if (!this.guildUpgrades.find((upgrade) => objUpgrade === upgrade)) {
                this.guildUpgrades.push(objUpgrade);
            }
        });
    }
}
