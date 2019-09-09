import {differenceInSeconds} from 'date-fns';
import {css, customElement, html, property} from 'lit-element';

import {BaseElement} from './base';

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
                display: block;
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

    private timerUpdateInterval;
    @property({type: String}) private claimedAtOutput: string = '';
    @property({type: String}) private lastFlippedOutput: string = '';

    public disconnectedCallback(): void {
        if (this.timerUpdateInterval) {
            clearInterval(this.timerUpdateInterval);
        }
    }

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

    protected firstUpdated(changedProperties: Map<PropertyKey, unknown>): void {
        this.updateTimers();
        this.timerUpdateInterval = window.setInterval(() => this.updateTimers.call(this), 1000);
    }

    protected render() {
        return html`<b>${this.objectiveData.name}</b>
        <dl>${this.renderDataEntries()}</dl>`;
    }

    private updateTimers() {
        this.lastFlippedOutput = this.formatTime(this.lastFlipped);
        this.claimedAtOutput = this.claimedAt ? this.formatTime(this.claimedAt) : '';
    }

    private renderDataEntries() {
        const infos = [html`<dt>${this.t('Turned')}</dt><dd>${this.lastFlippedOutput}</dd>`];

        if (this.claimedBy) {
            infos.push(
                html`<dt>${this.t('Guild')}</dt><dd><gw2-guild-name .guildId=${this.claimedBy}></gw2-guild-name></dd>`,
                html`<dt>${this.t('Claimed')}</dt><dd>${this.claimedAtOutput}</dd>`
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

    private formatTime(timeToFormat) {
        let secNum = differenceInSeconds(new Date(), timeToFormat);
        let time = '-';
        if (secNum) {
            const days = Math.floor(secNum / 86400);
            secNum -= days * 86400;
            let hours: number | string = Math.floor(secNum / 3600);
            secNum -= hours * 3600;
            let minutes: number | string = Math.floor(secNum / 60);
            secNum -= minutes * 60;
            let seconds: number | string = secNum;

            if (hours < 10) {
                hours = '0' + hours;
            }
            if (minutes < 10) {
                minutes = '0' + minutes;
            }
            if (seconds < 10) {
                seconds = '0' + seconds;
            }
            time = (days > 0 ? days + 'd ' : '');
            time += (hours > 0 || days > 0 ? hours + 'h ' : '');
            time += (minutes > 0 || hours > 0 || days > 0 ? minutes + 'm ' : '');
            time += seconds + 's';
        }
        return time;
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
