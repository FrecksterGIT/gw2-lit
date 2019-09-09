import {css, customElement, html, property} from 'lit-element';

import {BaseElement} from './base';

import {CLAIM, logChange} from '../store/actions/logger';
import {store} from '../store/store';

import './guild-name';

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

    @property({type: String}) private objectiveId: string;
    @property({type: Date}) private lastFlipped: Date;
    @property({type: String}) private owner: string;
    @property({type: String}) private claimedBy: string;
    @property({type: Date}) private claimedAt: Date;
    @property({type: Number}) private pointsTick: number;
    @property({type: Number}) private pointsCapture: number;
    @property({type: Number}) private yaksDelivered: number;
    @property({type: Array}) private guildUpgrades: number[] = [];

    @property() private objectiveData;

    public stateChanged(state) {
        super.stateChanged(state);
        if (state.match.matchData) {
            const objective = this.getObjective(state);

            this.lastFlipped = new Date(objective.last_flipped);
            this.owner = objective.owner;
            this.claimedBy = objective.claimed_by;
            this.claimedAt = new Date(objective.claimed_at);
            this.pointsTick = objective.points_tick;
            this.pointsCapture = objective.points_capture;
            this.yaksDelivered = objective.yaks_delivered;
            this.updateGuildUpgrades(objective.guild_upgrades);
        }
        if (state.resources.OBJECTIVES && state.resources.OBJECTIVES[this.objectiveId]) {
            this.objectiveData = state.resources.OBJECTIVES[this.objectiveId];
        }
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
                    this.owner,
                    changedProperties.get('claimedBy') as string,
                    this.claimedBy, this.claimedAt.toISOString()
                ));
        }
    }

    private renderDataEntries() {
        const infos = [html`<dt>${this.t('Turned')}</dt><dd>${this.lastFlipped.toLocaleTimeString()}</dd>`];

        if (this.claimedBy) {
            infos.push(
                html`<dt>${this.t('Guild')}</dt><dd><gw2-guild-name .guildId=${this.claimedBy}></gw2-guild-name></dd>`,
                html`<dt>${this.t('Claimed')}</dt><dd>${this.claimedAt.toLocaleTimeString()}</dd>`
            );
        }

        if (this.yaksDelivered < 140) {
            infos.push(html`<dt>${this.t('Dolyaks')}</dt><dd>${this.getDolyaks()}</dd>`);
        }

        return infos;
    }

    private getDolyaks() {
        if (this.yaksDelivered < 20) {
            return this.yaksDelivered + ' / 20';
        } else if (this.yaksDelivered < 60) {
            return (this.yaksDelivered - 20) + ' / 40';
        } else if (this.yaksDelivered < 140) {
            return (this.yaksDelivered - 60) + ' / 80';
        }
        return '';
    }

    private getObjective(state) {
        return state.match.matchData.maps.reduce((objective, map) => {
            if (objective) {
                return objective;
            }
            return map.objectives.reduce((found, obj) => {
                return obj.id === this.objectiveId ? obj : found;
            }, null);
        }, null);
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
