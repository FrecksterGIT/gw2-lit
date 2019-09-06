import {html, customElement, LitElement, property, css} from "lit-element";
import {connect} from "pwa-helpers/connect-mixin";

import {store} from "../store/store";
import './map';
import {fetchUpdate} from "../store/actions/match";
import {fetchObjectives} from "../store/actions/objectives";

@customElement('gw2-world')
 export class World extends connect(store)(LitElement) {

    @property() fetching: boolean = false;

    static get styles() {
        return [css`
            :host {
                background: url(world.jpg) center center no-repeat;
                background-size: contain;
                display: block;
                height: 0;
                margin: 0 auto;
                padding-bottom: 69.86%;
                position: relative;
                width: 100%;
            }`];
    }

    protected firstUpdated(_changedProperties: Map<PropertyKey, unknown>): void {
        store.dispatch<any>(fetchUpdate('2-1'));
        store.dispatch<any>(fetchObjectives());
        setInterval(() => {
            store.dispatch<any>(fetchUpdate('2-1'));
        }, 5000);
    }

    stateChanged(state) {
        this.fetching = state.match.fetching;
    }

    render() {
        return html`<gw2-map mapId="38"></gw2-map><gw2-map mapId="1099"></gw2-map><gw2-map mapId="96"></gw2-map><gw2-map mapId="95"></gw2-map>`;
    }
}