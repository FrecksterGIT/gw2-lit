import {differenceInSeconds} from 'date-fns';
import {css, customElement, html, property, unsafeCSS} from 'lit-element';
import {BaseElement} from './base';

import {CLAIM, logChange, OWNER} from '../store/actions/logger';
import {store} from '../store/store';

import './info';
import {Gw2Map} from './map';

import * as campIcon from '../../assets/images/gw2_wvw_map-vector--camp_transparent.svg';
import * as castleIcon from '../../assets/images/gw2_wvw_map-vector--castle_transparent.svg';
import * as keepIcon from '../../assets/images/gw2_wvw_map-vector--keep_transparent.svg';
import * as towerIcon from '../../assets/images/gw2_wvw_map-vector--tower_transparent.svg';

import * as claimed from '../../assets/images/claimed.png';
import * as tier1 from '../../assets/images/tier_1.png';
import * as tier2 from '../../assets/images/tier_2.png';
import * as tier3 from '../../assets/images/tier_3.png';
import * as waypoint from '../../assets/images/waypoint.png';

@customElement('gw2-objective')
export class Gw2Objective extends BaseElement {

    static get styles() {
        return [
            css`:host {
                font: 11px/13px 'Open Sans', sans-serif, arial;
            }`,
            css`:host .objective {
                background-color: #707070;
                border-radius: 50%;
                display: block;
                height: 26px;
                position: absolute;
                transform: translate(-13px, -13px);
                width: 26px;
                z-index: 1;
            }`,
            css`:host .objective:hover {
                z-index: 2;
            }`,
            css`:host .camp {
                background-image: url(${unsafeCSS(campIcon)});
            }`,
            css`:host .tower {
                background-image: url(${unsafeCSS(towerIcon)});
            }`,
            css`:host .keep {
                background-image: url(${unsafeCSS(keepIcon)});
            }`,
            css`:host .castle {
                background-image: url(${unsafeCSS(castleIcon)});
            }`,
            css`:host .icon {
                background-size: 28px 28px;
                background-position: center center;
                height: 26px;
                position: absolute;
                width: 26px;
            }`,
            css`:host .green {
                background-image: radial-gradient(circle at 50%, #7DBE63, #1e7b2d 53%);
            }`,
            css`:host .blue {
                background-image: radial-gradient(circle at 50%, #839AC0, #1a4da1 53%);
            }`,
            css`:host .red {
                background-image: radial-gradient(circle at 50%, #BA7471, #b02822 53%);
            }`,
            css`:host .timer {
                bottom: -14px;
                color: #fff;
                position: absolute;
                text-shadow: 0 -1px #000000, 1px 0 #000000, 0 1px #000000, -1px 0 #000000, 0 -1px 2px #000000, 1px 0 2px #000000, 0 1px 2px #000000, -1px 0 2px #000000, 0 -1px 2px #000000, 1px 0 2px #000000, 0 1px 2px #000000, -1px 0 2px #000000;
                z-index: 1;
            }`,
            css`:host .tier {
                background-size: contain;
                background-repeat: no-repeat;
                display: block;
                height: 12px;
                left: 1px;
                position: absolute;
                top: -5px;
                width: 24px;
            }`,
            css`:host .tier--1 {
                background-image: url(${unsafeCSS(tier1)})
            }`,
            css`:host .tier--2 {
                background-image: url(${unsafeCSS(tier2)})
            }`,
            css`:host .tier--3 {
                background-image: url(${unsafeCSS(tier3)})
            }`,
            css`:host .waypoint {
                background-image: url(${unsafeCSS(waypoint)});
                background-size: contain;
                background-repeat: no-repeat;
                bottom: -5px;
                display: block;
                height: 18px;
                right: -7px;
                position: absolute;
                width: 18px;
            }`,
            css`:host .claimed {
                background-image: url(${unsafeCSS(claimed)});
                background-size: contain;
                background-repeat: no-repeat;
                bottom: -2px;
                display: block;
                height: 13px;
                left: -4px;
                position: absolute;
                width: 13px;
            }`
        ];
    }

    @property({type: String}) private objectiveId: string;
    @property({type: String}) private type: string;
    @property({type: String}) private owner: string;
    @property({type: Date}) private lastFlipped: Date;
    @property({type: String}) private claimedBy: string;
    @property({type: Date}) private claimedAt: Date;

    @property() private objectiveData;
    @property() private coords: number[] = [0, 0];

    @property({type: Boolean}) private showInfo: boolean = false;
    @property({type: Number}) private tier: number;

    @property() private protectedTimerOutput: string = '';
    private protectedTimerInterval;

    public stateChanged(state) {
        super.stateChanged(state);

        if (state.match.matchData) {
            const objective = this.getObjective(state);

            this.type = objective.type;
            this.owner = objective.owner;
            this.lastFlipped = new Date(objective.last_flipped);
            this.claimedBy = objective.claimed_by;
            this.claimedAt = new Date(objective.claimed_at);
            this.tier = objective.yaks_delivered >= 140
                ? 3
                : objective.yaks_delivered >= 60
                    ? 2
                    : objective.yaks_delivered >= 20
                        ? 1
                        : 0;
        }

        if (state.resources.OBJECTIVES && state.resources.OBJECTIVES[this.objectiveId]) {
            this.objectiveData = state.resources.OBJECTIVES[this.objectiveId];
            this.coords = this.calculateCoords();
        }
    }

    protected updated(changedProperties: Map<PropertyKey, unknown>): void {
        super.updated(changedProperties);

        if (changedProperties.has('owner')) {
            store.dispatch(
                logChange(
                    OWNER,
                    this.objectiveData,
                    this.owner,
                    changedProperties.get('owner') as string,
                    this.owner,
                    this.lastFlipped.toISOString()
                ));
        }

        if (changedProperties.has('claimedBy') && this.claimedBy) {
            store.dispatch(
                logChange(
                    CLAIM,
                    this.objectiveData,
                    this.owner,
                    changedProperties.get('claimedBy') as string,
                    this.claimedBy,
                    this.claimedAt.toISOString()
                ));
        }

        if (changedProperties.has('owner')) {
            this.protectedTimerInterval = window.setInterval(() => this.updateTimer.call(this), 1000);
        }
    }

    protected render() {
        const iconClass = this.type ? this.type.toLowerCase() : '';
        const ownerClass = this.owner ? this.owner.toLowerCase() : '';

        return html`<div 
                class="objective ${ownerClass}" 
                style="left: ${this.coords[0]}%; top: ${this.coords[1]}%"
                @mouseenter=${() => (this.showInfo = true)}
                @mouseleave=${() => (this.showInfo = false)}>
            <div class="icon ${iconClass}"></div>
            ${this.protectedTimerOutput ? html`<div class="timer">${this.protectedTimerOutput}</div>` : html``}
            ${this.showInfo ? html`<gw2-info class="info" objectiveId=${this.objectiveId}></gw2-info>` : html``}
            ${this.tier ? html`<span class="tier tier--${this.tier}"></span>` : html``}
            ${this.tier === 3 ? html`<span class="waypoint"></span>` : html``}
            ${this.claimedBy ? html`<span class="claimed"></span>` : html``}
        </div>`;
    }

    private updateTimer() {
        const diff = 300 - differenceInSeconds(new Date(), this.lastFlipped);

        if (diff <= 0) {
            window.clearInterval(this.protectedTimerInterval);
            this.protectedTimerOutput = '';
        } else {
            this.protectedTimerOutput = this.formatTime(diff);
        }
    }

    private formatTime(secNum) {
        const hours: number | string = Math.floor(secNum / 3600);
        let minutes: number | string = Math.floor((secNum - hours * 3600) / 60);
        let seconds: number | string = secNum - hours * 3600 - minutes * 60;

        if (minutes < 10) {
            minutes = '0' + minutes;
        }
        if (seconds < 10) {
            seconds = '0' + seconds;
        }
        return minutes + ':' + seconds;
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

    private calculateCoords() {
        const map = Gw2Map.MAP_SIZES[this.objectiveData.map_id];
        const mapSize = [
            map[1][0] - map[0][0],
            map[1][1] - map[0][1]
        ];
        const point = this.objectiveData.coord;
        if (point) {
            const coord = [
                point[0] - map[0][0],
                point[1] - map[0][1]
            ];
            return [
                coord[0] / mapSize[0] * 100,
                coord[1] / mapSize[1] * 100
            ];
        }
    }
}
