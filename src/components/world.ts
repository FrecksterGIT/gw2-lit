import {css, customElement, html, LitElement, unsafeCSS} from 'lit-element';
import {connect} from 'pwa-helpers/connect-mixin';

import {fetchUpdate} from '../store/actions/match';
import {fetchObjectives} from '../store/actions/objectives';
import {store} from '../store/store';

import * as background from '../../assets/images/world.jpg';
import './map';

@customElement('gw2-world')
export class World extends connect(store)(LitElement) {

    static get styles() {
        return [css`
            :host {
                background: url(${unsafeCSS(background)}) center center no-repeat;
                background-size: contain;
                display: block;
                height: 0;
                margin: 0 auto;
                padding-bottom: 69.86%;
                position: relative;
                width: 100%;
            }`];
    }

    public render() {
        return html`<gw2-map mapId="38"></gw2-map><gw2-map mapId="1099"></gw2-map><gw2-map mapId="96"></gw2-map><gw2-map mapId="95"></gw2-map>`;
    }

    protected firstUpdated(changedProperties: Map<PropertyKey, unknown>): void {
        store.dispatch<any>(fetchUpdate('2-4'));
        store.dispatch<any>(fetchObjectives());
        setInterval(() => {
            store.dispatch<any>(fetchUpdate('2-4'));
        }, 5000);
    }
}
