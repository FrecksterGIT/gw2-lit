import {html, customElement, LitElement, property, css} from "lit-element";
import {connect} from "pwa-helpers/connect-mixin";

import {store} from "../store/store";
import './map';
import {Gw2Map} from "./map";

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
                background: red;
                display: block;
                height: 26px;
                position: absolute;
                width: 26px;
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
        const typeClass = this.type ? this.type.toLowerCase() : '';

        return html`<div class="objective ${typeClass}" style="left: ${this.coords[0]}%; top: ${this.coords[1]}%">
            ${this.objectiveData.name}
        </div>`;
    }
}
