import {html, customElement, LitElement, property, css, unsafeCSS} from "lit-element";
import {connect} from "pwa-helpers/connect-mixin";

import {store} from "../store/store";
import {Gw2Map} from "./map";

import * as campIcon from '../../assets/images/gw2_wvw_map-vector--camp_transparent.svg';
import * as towerIcon from '../../assets/images/gw2_wvw_map-vector--tower_transparent.svg';
import * as keepIcon from '../../assets/images/gw2_wvw_map-vector--keep_transparent.svg';
import * as castleIcon from '../../assets/images/gw2_wvw_map-vector--castle_transparent.svg';

@customElement('gw2-objective')
export class Gw2Objective extends connect(store)(LitElement) {

    @property({type: String}) objectiveId: string;

    @property() objectiveData;
    @property() coords;
    @property({type: String}) type: string;
    @property({type: String}) owner: string;

    @property({type: String}) lastFlipped: string;
    @property({type: String}) claimedBy: string;
    @property({type: String}) claimedAt: string;
    @property({type: Number}) pointsTick: number;
    @property({type: Number}) pointsCapture: number;
    @property({type: Number}) yaksDelivered: number;
    @property({type: Array}) guildUpgrades: Array<number> = [];

    static get styles() {
        return [
            css`:host .objective {
                background-color: #707070;
                border-radius: 50%;
                display: block;
                height: 26px;
                position: absolute;
                width: 26px;
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
            }`
        ];
    }

    stateChanged(state) {
        if (state.match.matchData) {
            const objective = state.match.matchData.maps.reduce((objective, map) => {
                if (objective) return objective;
                return map.objectives.reduce((found, objective) => {
                    return objective.id === this.objectiveId ? objective : found;
                }, null);
            }, null);

            this.type = objective.type;
            this.owner = objective.owner;
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
            this.coords = this.calculateCoords();
        }
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

    private updateGuildUpgrades(objUpgrades) {
        if (!objUpgrades && this.guildUpgrades) {
            this.guildUpgrades = [];
        }
        objUpgrades.forEach(objUpgrade => {
            if (!this.guildUpgrades.find(upgrade => objUpgrade === upgrade)) {
                this.guildUpgrades.push(objUpgrade);
            }
        });
    }

    render() {
        const iconClass = this.type ? this.type.toLowerCase() : '';
        const ownerClass = this.owner ? this.owner.toLowerCase() : '';

        return html`<div class="objective ${ownerClass}" style="left: ${this.coords[0]}%; top: ${this.coords[1]}%">
            <div class="icon ${iconClass}"></div>
            ${this.objectiveData.name}
        </div>`;
    }
}
