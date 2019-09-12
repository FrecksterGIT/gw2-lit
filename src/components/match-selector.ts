import {css, customElement, html, property, unsafeCSS} from 'lit-element';
import {clearLog} from '../store/actions/logger';
import {changeMatch} from '../store/actions/match';
import {fetchMatches} from '../store/actions/resources';
import {store} from '../store/store';

import {BaseElement} from './base';

import * as globe from '../../assets/images/globe.svg';

@customElement('gw2-match-selector')
export class MatchSelector extends BaseElement {

    @property() private matchesData = {};
    @property() private worldData = {};
    @property({type: Boolean}) private showSelector = false;

    static get styles() {
        return [
            css`:host {
                display: block;
                flex: 0 0 auto;
                font: 11px/13px 'Open Sans', sans-serif, arial;
                position: relative;
                width: 16px;
            }`,
            css`:host .open-selector {
                background: url(${unsafeCSS(globe)});
                background-repeat: no-repeat;
                border: none;
                display: block;
                height: 16px;
                text-indent: -1000px;
                width: 16px;
            }`,
            css`:host .selector {
                background: #fff;
                bottom: 0;
                left: 16px;
                padding: 10px;
                position: absolute;
                width: 427px;
                z-index: 2;
            }`,
            css`:host .red {
                color: #b02822;
            }`,
            css`:host .blue {
                color: #1a4da1;
            }`,
            css`:host .green {
                color: #1e7b2d;
            }`
        ];
    }

    public stateChanged(state) {
        super.stateChanged(state);

        if (state.resources.WORLDS) {
            this.worldData = state.resources.WORLDS;
        }

        if (state.resources.MATCHES) {
            this.matchesData = state.resources.MATCHES;
        }
    }

    protected firstUpdated(changedProperties: Map<PropertyKey, unknown>): void {
        store.dispatch<any>(fetchMatches());
    }

    protected render() {
        return html`
            <button class="open-selector" @click=${() => (this.showSelector = !this.showSelector)}>matches</button>
            ${this.showSelector ? html`<div class="selector">${this.renderWorlds()}</div>` : html``}`;
    }

    private renderWorlds() {
        if (this.matchesData) {
            return Object.keys(this.matchesData).map((matchId) => {
                const matchData = this.matchesData[matchId];
                return html`<div @click="${() => (store.dispatch(clearLog()) && store.dispatch(changeMatch(matchId)) && (this.showSelector = false))}">
                        ${this.renderLinkedWorlds(matchData, 'green')}
                        ${this.renderLinkedWorlds(matchData, 'blue')}
                        ${this.renderLinkedWorlds(matchData, 'red')}
                    </div>`;
            });
        }
    }

    private renderLinkedWorlds(worldData, color) {
        const mainWorld = worldData.worlds[color];
        const linkedWorlds = worldData.all_worlds[color];
        const worlds = linkedWorlds.filter((world) => world !== mainWorld);

        return html`<span class="worlds ${color}">
                ${this.getWorldName(mainWorld)}
                ${worlds.length ? html`<span class="linked">${worlds.map((world) => this.getWorldName(world))}</span>` : ''}
            </span>`;
    }

    private getWorldName(id: number) {
        return (this.worldData && this.worldData[id]) ? this.worldData[id].name : id;
    }
}
