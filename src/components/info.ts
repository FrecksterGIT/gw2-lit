import {css, customElement, html, property} from 'lit-element';

import {BaseElement} from '../base';

import {CLAIM, logChange} from '../store/actions/logger';
import {store} from '../store/store';

@customElement('gw2-info')
export class Gw2Info extends BaseElement {

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

    @property() protected objectiveId;
    @property() protected objectiveData;

    @property({type: Date}) protected lastFlipped: Date;
    @property({type: String}) protected claimedBy: string;
    @property({type: Date}) protected claimedAt: Date;
    @property({type: Number}) protected pointsTick: number;
    @property({type: Number}) protected pointsCapture: number;
    @property({type: Number}) protected yaksDelivered: number;
    @property({type: Array}) protected guildUpgrades: number[] = [];

    public stateChanged(state) {
        super.stateChanged(state);
        if (state.match.matchData) {
            const objective = this.getObjective(state);

            this.lastFlipped = new Date(objective.last_flipped);
            this.claimedBy = objective.claimed_by;
            this.claimedAt = new Date(objective.claimed_at);
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
            html`<dt>${this.t('Turned')}</dt><dd>${this.lastFlipped.toLocaleTimeString()}</dd>`,
            html`<dt>${this.t('Guild')}</dt><dd>${this.claimedBy}</dd>`,
            html`<dt>${this.t('Claimed')}</dt><dd>${this.claimedAt.toLocaleTimeString()}</dd>`,
            html`<dt>${this.t('Dolyaks')}</dt><dd>${this.yaksDelivered}</dd>`
        ];
    }

    protected render() {
        return html`<b>${this.objectiveData.name}</b>
        <dl>${this.renderDataEntries()}</dl>`;
    }

    protected updated(changedProperties: Map<PropertyKey, unknown>): void {
        super.updated(changedProperties);
        if (changedProperties.has('claimedBy') && this.claimedBy) {
            store.dispatch(
                logChange(
                    CLAIM,
                    this.objectiveData,
                    changedProperties.get('claimedBy') as string,
                    this.claimedBy, this.claimedAt.toISOString()
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
