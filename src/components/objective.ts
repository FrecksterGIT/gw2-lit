import {css, customElement, html, property, unsafeCSS} from 'lit-element';
import {BaseElement} from './base';

import {logChange, OWNER} from '../store/actions/logger';
import {store} from '../store/store';

import './info';
import {Gw2Map} from './map';

import * as campIcon from '../../assets/images/gw2_wvw_map-vector--camp_transparent.svg';
import * as castleIcon from '../../assets/images/gw2_wvw_map-vector--castle_transparent.svg';
import * as keepIcon from '../../assets/images/gw2_wvw_map-vector--keep_transparent.svg';
import * as towerIcon from '../../assets/images/gw2_wvw_map-vector--tower_transparent.svg';

@customElement('gw2-objective')
export class Gw2Objective extends BaseElement {

    static get styles() {
        return [
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
            css`:host .info {
                display: none;
            }`,
            css`:host .objective:hover .info {
                display: block;
            }`
        ];
    }

    @property({type: String}) public objectiveId: string;

    @property() public objectiveData;
    @property() public coords = [0, 0];
    @property({type: String}) public type: string;
    @property({type: String}) public owner: string;
    @property({type: String}) public lastFlipped: string;

    public stateChanged(state) {
        super.stateChanged(state);
        if (state.match.matchData) {
            const objective = this.getObjective(state);

            this.type = objective.type;
            this.owner = objective.owner;
            this.lastFlipped = objective.last_flipped;
        }
        if (state.resources.OBJECTIVES && state.resources.OBJECTIVES[this.objectiveId]) {
            this.objectiveData = state.resources.OBJECTIVES[this.objectiveId];
            this.coords = this.calculateCoords();
        }
    }

    protected render() {
        const iconClass = this.type ? this.type.toLowerCase() : '';
        const ownerClass = this.owner ? this.owner.toLowerCase() : '';

        return html`<div class="objective ${ownerClass}" style="left: ${this.coords[0]}%; top: ${this.coords[1]}%">
            <div class="icon ${iconClass}"></div>
            <gw2-info class="info" objectiveId=${this.objectiveId}></gw2-info>
        </div>`;
    }

    protected updated(changedProperties: Map<PropertyKey, unknown>): void {
        super.updated(changedProperties);
        if (changedProperties.has('owner')) {
            store.dispatch(
                logChange(
                    OWNER,
                    this.objectiveData,
                    changedProperties.get('owner') as string,
                    this.owner,
                    this.lastFlipped
                ));
        }
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
