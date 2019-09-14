import {css, customElement, html, property} from 'lit-element';

import {BaseElement} from './base';

@customElement('gw2-match-overview')
export class MatchOverview extends BaseElement {

    @property() private worlds = {
        blue: 0,
        green: 0,
        red: 0
    };
    @property() private allWorlds = {
        blue: [],
        green: [],
        red: []
    };

    @property() private skirmishScores = {
        blue: 0,
        green: 0,
        red: 0
    };

    @property() private victoryPoints = {
        blue: 0,
        green: 0,
        red: 0
    };

    @property() private worldData = {};
    @property() private matchData;

    static get styles() {
        return [
            css`:host {
                display: block;
                flex: 0 0 auto;
                font: 11px/13px 'Open Sans', sans-serif, arial;
                width: calc(50% - 8px);
            }`,
            css`:host .worlds {
                position: relative;
            }`,
            css`:host .linked {
                background: #fff;
                border: 1px solid #e1e1e1;
                display: none;
                flex-flow: row nowrap;
                left: 50px;
                padding: 2px;
                position: absolute;
                top: -3px;
                white-space: nowrap;
                z-index: 2;
            }`,
            css`:host .worlds:hover .linked {
                display: flex;
            }`,
            css`:host .red {
                color: #b02822;
            }`,
            css`:host .blue {
                color: #1a4da1;
            }`,
            css`:host .green {
                color: #1e7b2d;
            }`,
            css`:host .row {
                width: 100px;
            }`,
            css`:host .row span {
                border-radius: 4px;
                display: block;
                height: 8px;
                transition: width 1s;
            }`,
            css`:host .row .red {
                background: #b02822;
            }`,
            css`:host .row .blue {
                background: #1a4da1;
            }`,
            css`:host .row .green {
                background: #1e7b2d;
            }`
        ];
    }

    public stateChanged(state) {
        super.stateChanged(state);

        if (state.match.matchData) {
            this.matchData = state.match.matchData;
        }

        if (state.resources.WORLDS) {
            this.worldData = state.resources.WORLDS;
        }
    }

    protected updated(changedProperties: Map<PropertyKey, unknown>): void {
        super.updated(changedProperties);

        if (changedProperties.has('matchData')) {
            this.worlds = this.matchData.worlds;
            this.allWorlds = this.matchData.all_worlds;
            this.victoryPoints = this.matchData.victory_points;

            const skirmish = this.matchData.skirmishes[this.matchData.skirmishes.length - 1];
            this.skirmishScores = skirmish.scores;
        }
    }

    protected render() {
        return html`${this.renderWorlds()}`;
    }

    private renderWorlds() {
        return html`<table>
            <tr>
                <th>${this.t('World')}</th>
                <th>${this.t('Income')}</th>
                <th rowspan="4"></th>
                <th colspan="2">${this.t('Points')}</th>
                <th colspan="2">${this.t('Victory Points')}</th>
            </tr>
            <tr>${this.renderWorldData('green')}</tr>
            <tr>${this.renderWorldData('blue')}</tr>
            <tr>${this.renderWorldData('red')}</tr>
        </table>`;
    }

    private renderWorldData(color) {
        const maxVictoryPoints = Math.max(this.victoryPoints.green, this.victoryPoints.blue, this.victoryPoints.red);
        const diffVictoryPoints = this.victoryPoints[color] - maxVictoryPoints;

        const maxScores = Math.max(this.skirmishScores.green, this.skirmishScores.blue, this.skirmishScores.red);

        return html`<td>${this.renderLinkedWorlds(color)}</td>
            <td>${this.getIncome(color)}</td>
            <td>${this.skirmishScores[color]}</td>
            <td class="row"><span class="${color}" style="width: ${this.skirmishScores[color] / maxScores * 100}%"></span></td>
            <td>${this.victoryPoints[color]}</td>
            <td>${diffVictoryPoints < 0 ? diffVictoryPoints : ''}</td>`;
    }

    private renderLinkedWorlds(color) {
        const mainWorld = this.worlds[color];
        const linkedWorlds = this.allWorlds[color];
        const worlds = linkedWorlds.filter((world) => world !== mainWorld);

        return html`<span class="worlds ${color}">
                ${this.getWorldName(mainWorld)}
                ${worlds.length ? html`<span class="linked">${worlds.map((world) => this.getWorldName(world)).join(', ')}</span>` : ''}
            </span>`;
    }

    private getWorldName(id: number) {
        return (this.worldData && this.worldData[id]) ? this.worldData[id].name : id;
    }

    private getIncome(color: string): number {
        if (this.matchData && this.matchData.maps) {
            return this.matchData.maps.reduce((income, map) => {
                return map.objectives.reduce((sum, objective) => {
                    if (objective.owner.toLowerCase() === color) {
                        return sum + objective.points_tick;
                    }
                    return sum;
                }, income);
            }, 0);
        }
        return 0;
    }
}
