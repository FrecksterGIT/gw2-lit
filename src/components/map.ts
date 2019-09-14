import {css, customElement, html, property} from 'lit-element';

import {BaseElement} from './base';
import './objective';

@customElement('gw2-map')
export class Gw2Map extends BaseElement {

    @property({type: Number}) private mapId: number;
    @property({type: String}) private type: string;
    @property({type: Array}) private objectives: number[] = [];

    @property() private mapData;

    public static get MAP_SIZES() {
        return {
            38: [[8958, 12798], [12030, 15870]],
            95: [[5630, 11518], [8702, 14590]],
            96: [[12798, 10878], [15870, 13950]],
            1099: [[9214, 8958], [12286, 12030]]
        };
    }

    static get styles() {
        return [
            css`:host {
                height: auto;
                position: absolute;
                width: 29.5%;
            }`,
            css`:host:before {
                content: "";
                float: left;
                padding-bottom: 100%;
                width: 100%;
            }`,
            css`:host([mapid="38"]) {
                left: 35.8%;
                top: 56.6%;
                width: 29%;
            }`,
            css`:host([mapid="1099"]) {
                left: 38%;
                top: 0;
            }`,
            css`:host([mapid="96"]) {
                left: 73.8%;
                top: 28.9%;
            }`,
            css`:host([mapid="95"]) {
                left: 2%;
                top: 38.1%;
            }`
        ];
    }

    public stateChanged(state) {
        super.stateChanged(state);

        if (state.match.matchData) {
            this.mapData = state.match.matchData.maps.find((m) => m.id === this.mapId);
        }
    }

    protected updated(changedProperties: Map<PropertyKey, unknown>): void {
        super.updated(changedProperties);

        if (changedProperties.has('mapData')) {
            this.type = this.mapData.type;
            this.objectives = this.getObjectives();
        }
    }

    protected render() {
        const objectives = this.objectives.map((objective) => this.renderObjective(objective));

        return html`${objectives}`;
    }

    private renderObjective(objId) {
        return html`<gw2-objective objectiveId=${objId}></gw2-objective>`;
    }

    private getObjectives(): number[] {
        return this.mapData.objectives
            .filter((objective) => (
                objective.type !== 'Spawn'
                && objective.type !== 'Ruins'
                && objective.type !== 'Mercenary'
            ))
            .map((objective) => objective.id);
    }
}
